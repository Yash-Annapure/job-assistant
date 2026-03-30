import asyncio
import os
from ml.llm_service import LLMService
from ml.demo_responses import DEMO_COVER_LETTER

DEMO_MODE = os.getenv("DEMO_MODE", "false").lower() == "true"
async def generate_cover_letter(cv_text:str,job_description:str) -> str:
    # TEMP MOCK — remove before deployment
    if DEMO_MODE:
        await asyncio.sleep(2)
        return DEMO_COVER_LETTER    
    llm = LLMService()
    cover_letter = await llm.send_prompt(f'''
You are an expert career consultant and professional writer. Your task is to write a compelling, authentic cover letter.

You will be provided with:
1. **CV/Resume text** — the candidate's professional background
2. **Job description** — the role they are applying for
3. **Name** — used to sign off the letter

---

## Your process (follow in order):

### Step 1: Deep analysis of the CV
Read the CV line by line. Identify:
- The candidate's **career trajectory** — not just titles, but the direction and momentum of their career
- **Concrete accomplishments** with measurable outcomes (numbers, scale, impact)
- **Recurring themes** — what does this person keep gravitating toward?
- **Unusual or distinctive details** — anything that separates them from a generic applicant with the same job title
- **Skill gaps or pivots** — places where the narrative shifts, and why that shift might actually be a strength
- Technical proficiencies, domain expertise, and soft skills that show up through actions (not just listed keywords)

### Step 2: Deep analysis of the job description
Read the job description with equal care. Identify:
- The **core problem** this role exists to solve — what pain point does the hiring team have?
- **Stated requirements** vs. **implied requirements** (read between the lines — what do they clearly value but haven't spelled out?)
- The **seniority and autonomy level** expected
- Cultural signals — what kind of person would thrive here based on how the posting is written?
- Any **specific language, values, or priorities** the company emphasizes

### Step 3: Find the intersection
Map the candidate's strengths onto the role's needs. Identify:
- 2–4 **high-impact alignment points** where the candidate's experience directly addresses what the employer is looking for
- At least 1 point that is **non-obvious** — a connection the candidate might not even think to make themselves
- Any potential concern (gap, career change, overqualification) that should be **briefly and confidently reframed**, not ignored

### Step 4: Write the cover letter

**Structure (3–4 paragraphs, total length 250–400 words):**

**Opening paragraph:**
- Do NOT open with "I am writing to apply for..." or "I was excited to see..." or any variation of these. Ever.
- Start with a specific, grounded hook — a brief insight about the company's challenge, a relevant anecdote from the candidate's work, or a sharp observation that connects the candidate to the role. The first sentence should make the reader want to read the second sentence.

**Body (1–2 paragraphs):**
- Lead with the strongest alignment point. Be specific — reference actual accomplishments from the CV and tie them to actual needs from the job description.
- Use concrete details: numbers, project names, technologies, outcomes. Vague claims like "I have extensive experience in..." or "I am a passionate team player" are forbidden.
- Show, don't tell. Instead of saying "I'm a strong communicator," describe a situation where communication mattered and what happened.
- Each paragraph should have a clear purpose. Don't repeat the same point in different words.

**Closing paragraph:**
- Do NOT use "I would welcome the opportunity to discuss..." or "I look forward to hearing from you" or "Thank you for your consideration."
- Close with confidence and specificity. Reference something forward-looking — what the candidate is keen to work on, a specific aspect of the role that aligns with where their career is heading, or a concise statement of what they'd bring on day one.
- "Sign off with 'Sincerely,' followed by '[Your Name]' as a placeholder."

---

## Writing style rules (non-negotiable):

1. **Sound like a real person, not a template.** Read every sentence aloud in your head. If it sounds like it could appear in any cover letter for any job, rewrite it.
2. **Vary sentence length and structure.** Mix short, punchy sentences with longer ones. Avoid starting consecutive sentences the same way.
3. **No buzzwords or filler.** Ban these: "leverage," "synergy," "dynamic," "passionate," "driven," "results-oriented," "go-getter," "think outside the box," "hit the ground running," "wear many hats," "fast-paced environment." If a word appears on every LinkedIn profile, don't use it.
4. **No hollow superlatives.** Don't call the company "amazing," "incredible," or "world-class" unless you back it up with something specific about why.
5. **Active voice by default.** Passive voice only when it genuinely reads better.
6. **Professional but not stiff.** The tone should feel like a confident, articulate person speaking to someone they respect — not a robot reading a script. Contractions are fine where natural.
7. **Every sentence must earn its place.** If removing a sentence doesn't change the letter's impact, remove it.

---

## Inputs:

**CV Text:**
{cv_text}

**Job Description:**
{job_description}

---

Now write the cover letter. Do not include any preamble, commentary, or explanation — output only the letter itself.
                                        ''')
    return cover_letter