import sys
import os
import pytest
import hashlib
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Patch TextEmbedding at import time so module-level model init doesn't fail
with patch("fastembed.TextEmbedding", return_value=MagicMock()):
    from ml.job_matcher import (
        strip_html,
        build_cv_embed_text,
        filter_skills_by_overlap,
        safe_slice,
        normalise_score,
        hybrid_score,
        _match_cache,
    )


# ── strip_html ────────────────────────────────────────────────────────────────

def test_strip_html_removes_tags():
    html = "<p>We need <strong>Python</strong> and <em>Docker</em></p>"
    assert strip_html(html) == "We need Python and Docker"

def test_strip_html_collapses_whitespace():
    html = "<ul>\n  <li>React</li>\n  <li>FastAPI</li>\n</ul>"
    result = strip_html(html)
    assert "React" in result
    assert "FastAPI" in result
    assert "<" not in result
    assert "\n" not in result

def test_strip_html_plain_text_unchanged():
    text = "Python Django REST API"
    assert strip_html(text) == text


# ── build_cv_embed_text ───────────────────────────────────────────────────────

def test_build_cv_embed_text_joins_skills():
    skills = ["Python", "Docker", "FastAPI"]
    assert build_cv_embed_text(skills) == "Python, Docker, FastAPI"

def test_build_cv_embed_text_empty_returns_empty():
    assert build_cv_embed_text([]) == ""


# ── filter_skills_by_overlap ──────────────────────────────────────────────────

def test_filter_skills_returns_all_skills():
    # filter_skills_by_overlap is a passthrough — LLM handles semantic matching
    skills = ["Python", "Docker", "Kubernetes", "React"]
    job_text = "We are looking for a Python developer with Docker experience."
    result = filter_skills_by_overlap(skills, job_text)
    assert result == skills

def test_filter_skills_returns_all_if_no_job_text():
    skills = ["Python", "Docker"]
    result = filter_skills_by_overlap(skills, "")
    assert result == skills


# ── safe_slice ────────────────────────────────────────────────────────────────

def test_safe_slice_respects_word_boundary():
    text = "Python developer with Docker experience in data engineering"
    result = safe_slice(text, 40)
    assert not result.endswith("engi")
    assert "<" not in result
    assert result == "Python developer with Docker experience"

def test_safe_slice_returns_full_if_under_limit():
    text = "Python Docker"
    assert safe_slice(text, 100) == "Python Docker"

def test_safe_slice_empty_string():
    assert safe_slice("", 100) == ""


# ── normalise_score ───────────────────────────────────────────────────────────

def test_normalise_score_zero_raw_gives_zero():
    assert normalise_score(0.0) == 0.0

def test_normalise_score_at_ceiling_gives_hundred():
    assert normalise_score(1.0) == 100.0

def test_normalise_score_midpoint():
    result = normalise_score(0.5)
    assert abs(result - 50.0) < 1.0

def test_normalise_score_negative_clamps_to_zero():
    assert normalise_score(-0.1) == 0.0

def test_normalise_score_rounds_to_two_decimals():
    result = normalise_score(0.755)
    assert result == round(result, 2)


# ── hybrid_score ─────────────────────────────────────────────────────────────

def test_hybrid_score_high_skill_overlap_raises_score():
    # 34 matching, 2 missing — should push well above the cosine score
    result = hybrid_score(64.0, ["Python"] * 34, ["Excel", "Digital Twins"])
    assert result > 80.0

def test_hybrid_score_no_skills_returns_cosine():
    assert hybrid_score(64.0, [], []) == 64.0

def test_hybrid_score_all_missing_lowers_score():
    result = hybrid_score(70.0, [], ["A", "B", "C", "D", "E"])
    assert result < 70.0

def test_hybrid_score_weights():
    # 50% matching, 50% missing -> skill_pct=50, cosine=60 -> 0.4*60 + 0.6*50 = 54
    result = hybrid_score(60.0, ["A", "B"], ["C", "D"])
    assert abs(result - 54.0) < 0.1


# ── _match_cache ──────────────────────────────────────────────────────────────

def test_cache_stores_and_retrieves():
    _match_cache.clear()
    key = hashlib.md5("test_key".encode()).hexdigest()
    result = {"matching_skills": ["Python"], "missing_skills": ["Java"]}
    assert key not in _match_cache
    _match_cache[key] = result
    assert _match_cache[key] == result
    _match_cache.clear()

def test_cache_miss_returns_none():
    _match_cache.clear()
    key = hashlib.md5("nonexistent".encode()).hexdigest()
    assert _match_cache.get(key) is None
