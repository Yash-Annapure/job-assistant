# Guards that GET /users/me returns exactly id/username/email and never leaks
# hashed_password, even if the route returns the raw User ORM object.
import sys, os
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
import main
from db.models import User
from auth_utils import get_current_user


@pytest.fixture
def client():
    user = User(id=1, username="tester", email="a@b.com", hashed_password="$2b$12$secret")
    main.app.dependency_overrides[get_current_user] = lambda: user
    yield TestClient(main.app)
    main.app.dependency_overrides.clear()


def test_me_returns_only_safe_fields(client):
    body = client.get("/users/me").json()
    assert body == {"id": 1, "username": "tester", "email": "a@b.com"}
    assert "hashed_password" not in body
