import os
import re
import hashlib
import json
import asyncio
from fastembed import TextEmbedding
from sklearn.metrics.pairwise import cosine_similarity
from ml.llm_service import LLMService
from ml.demo_responses import DEMO_MATCH_RESULT

DEMO_MODE = os.getenv("DEMO_MODE", "false").lower() == "true"

# In-process LLM result cache: hash(filtered_skills + job_description) -> skill analysis dict
_match_cache: dict = {}

model = TextEmbedding("BAAI/bge-small-en-v1.5")

# No floor adjustment — raw cosine * 100 gives the most intuitive score
_SCORE_FLOOR = 0.0
_SCORE_CEIL  = 1.0


def strip_html(text: str) -> str:
    """Remove HTML tags and collapse whitespace."""
    text = re.sub(r'<[^>]+>', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()


def build_cv_embed_text(skills: list) -> str:
    """Join extracted skills into a comma-separated sentence for embedding."""
    return ", ".join(skills)


def filter_skills_by_overlap(skills: list, job_text: str) -> list:
    """Return all skills — word-overlap pre-filtering was too aggressive for
    multilingual job descriptions and is now bypassed. The LLM handles matching."""
    return skills


def safe_slice(text: str, limit: int) -> str:
    """Slice text to limit characters without cutting mid-word."""
    if len(text) <= limit:
        return text
    return text[:limit].rsplit(' ', 1)[0]


def normalise_score(raw: float) -> float:
    """Rescale BGE cosine similarity to 0-100."""
    normalised = (raw - _SCORE_FLOOR) / (_SCORE_CEIL - _SCORE_FLOOR)
    return round(max(0.0, normalised) * 100, 2)


def hybrid_score(cosine_pct: float, matching: list, missing: list) -> float:
    """Blend cosine similarity (40%) with skill overlap ratio (60%).
    Skill overlap is robust against multilingual job descriptions where
    English-model cosine similarity is artificially suppressed."""
    total = len(matching) + len(missing)
    if total == 0:
        return cosine_pct
    skill_pct = len(matching) / total * 100
    return round(0.4 * cosine_pct + 0.6 * skill_pct, 2)


async def match_cv_to_job(cv_text: str, job_description: str, skills: list) -> dict:
    if DEMO_MODE:
        await asyncio.sleep(2)
        return DEMO_MATCH_RESULT

    llm = LLMService()

    # 1. Strip HTML — used for both embedding and LLM prompt
    clean_jd = strip_html(job_description)

    # 2. Embed CV text vs clean job description — richer semantic signal than a keyword list
    cv_embed_text = safe_slice(cv_text, 2000)
    embeddings = list(model.embed([cv_embed_text, clean_jd]))
    cv_embedding = embeddings[0]
    job_embedding = embeddings[1]

    match_score = cosine_similarity([cv_embedding], [job_embedding])[0][0]
    # 3. Normalise score using BGE empirical floor/ceiling
    score_percentage = normalise_score(float(match_score))

    if not skills:
        return {
            "match_score": score_percentage,
            "skill-analysis": {"matching_skills": [], "missing_skills": []}
        }

    # 4. Pre-filter skills by word overlap to reduce LLM token usage
    filtered_skills = filter_skills_by_overlap(skills, clean_jd)

    # 5. Cache check — skip LLM if same inputs seen before
    cache_key = hashlib.md5(
        f"{sorted(filtered_skills)}{safe_slice(clean_jd, 2000)}".encode()
    ).hexdigest()

    if cache_key in _match_cache:
        cached = _match_cache[cache_key]
        return {
            "match_score": hybrid_score(
                score_percentage,
                cached.get("matching_skills", []),
                cached.get("missing_skills", []),
            ),
            "skill-analysis": cached
        }

    # 6. LLM skill analysis with safe word-boundary slice
    missing_and_matching_info = await llm.send_prompt(
        f"You are a skill matcher. Match semantically, not just by exact wording.\n"
        f"- matching_skills: skills from the candidate's list that are relevant to this role (explicitly mentioned OR commonly used in this type of role)\n"
        f"- missing_skills: skills the job requires or strongly implies that are NOT in the candidate's list\n\n"
        f"Candidate skills: {filtered_skills}\n"
        f"Job description: {safe_slice(clean_jd, 2000)}\n\n"
        f"Return ONLY valid JSON: {{\"matching_skills\": [], \"missing_skills\": []}}"
    )
    missing_and_matching_info = missing_and_matching_info.strip().replace("```json", "").replace("```", "")
    missing_and_matching_info = json.loads(missing_and_matching_info)

    # Store result in cache
    _match_cache[cache_key] = missing_and_matching_info

    final_score = hybrid_score(
        score_percentage,
        missing_and_matching_info.get("matching_skills", []),
        missing_and_matching_info.get("missing_skills", []),
    )
    return {
        "match_score": final_score,
        "skill-analysis": missing_and_matching_info
    }
