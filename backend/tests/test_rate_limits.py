# Guards that the @limiter.limit decorators on the LLM/external-API routes are
# actually wired (wrong decorator order silently no-ops them).
import sys, os
from unittest.mock import MagicMock
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
import main
from db.database import get_db
from auth_utils import get_current_user


@pytest.fixture
def client():
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = None
    main.app.dependency_overrides[get_db] = lambda: db
    main.app.dependency_overrides[get_current_user] = lambda: MagicMock(id=1)
    main.limiter.reset()
    yield TestClient(main.app)
    main.app.dependency_overrides.clear()


@pytest.mark.parametrize("method,path,kwargs,cap", [
    ("post", "/cv/analyze", {}, 10),
    ("post", "/cv/upload", {"files": {"file": ("a.txt", b"x")}}, 10),
    ("post", "/jobs/match", {"json": {"job_description": "x"}}, 10),
    ("post", "/jobs/cover-letter", {"json": {"job_description": "x"}}, 10),
    ("post", "/auth/login", {"json": {"email": "a@b.com", "password": "xxxxxxxx"}}, 10),
])
def test_route_is_rate_limited(client, method, path, kwargs, cap):
    codes = [getattr(client, method)(path, **kwargs).status_code for _ in range(cap + 1)]
    assert 429 not in codes[:cap]
    assert codes[cap] == 429


def test_search_is_rate_limited(client, monkeypatch):
    monkeypatch.setattr("api.jobs.httpx.AsyncClient", MagicMock(side_effect=RuntimeError))
    codes = []
    for _ in range(21):
        try:
            codes.append(client.get("/jobs/search", params={"query": "dev"}).status_code)
        except RuntimeError:
            codes.append(0)
    assert codes[20] == 429
