# Guards that an MCP client's Authorization header actually reaches the protected
# route behind an MCP tool. fastapi-mcp proxies each tool call as a real HTTP
# request and only re-attaches headers in its allowlist (default: authorization),
# so this silently breaks if the transport or that allowlist changes.
import asyncio, sys, os, json
from unittest.mock import MagicMock
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
import main
from db.database import get_db
from auth_utils import create_access_token

TOOL = "get_me_users_me_get"  # MCP tool backing GET /users/me
MCP_HEADERS = {"Accept": "application/json, text/event-stream", "Content-Type": "application/json"}


@pytest.fixture
def client(monkeypatch):
    # The MCP HTTP transport needs the app lifespan running, and this app's
    # lifespan touches a real DB — stub that out, keep everything else real.
    monkeypatch.setattr(main, "create_db_and_tables", lambda: None)
    # fastapi-mcp binds its session manager to the event loop of the first request
    # and never rebinds; TestClient gives each test a fresh loop, so reset it.
    t = main.mcp_server._http_transport
    t._manager_started, t._session_manager, t._manager_task = False, None, None
    t._startup_lock = asyncio.Lock()
    user = MagicMock(id=1, username="tester", email="a@b.com")
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = user
    main.app.dependency_overrides[get_db] = lambda: db
    with TestClient(main.app) as c:
        yield c
    main.app.dependency_overrides.clear()


def _call_tool(client, auth_header):
    """Run a full MCP session over /mcp and return the tools/call JSON-RPC reply."""
    headers = {**MCP_HEADERS, **auth_header}
    init = client.post("/mcp", headers=headers, json={
        "jsonrpc": "2.0", "id": 1, "method": "initialize",
        "params": {"protocolVersion": "2025-06-18", "capabilities": {},
                   "clientInfo": {"name": "test", "version": "1"}},
    })
    assert init.status_code == 200, init.text
    headers["mcp-session-id"] = init.headers["mcp-session-id"]

    client.post("/mcp", headers=headers,
                json={"jsonrpc": "2.0", "method": "notifications/initialized"})

    call = client.post("/mcp", headers=headers, json={
        "jsonrpc": "2.0", "id": 2, "method": "tools/call",
        "params": {"name": TOOL, "arguments": {}},
    })
    assert call.status_code == 200, call.text
    return call.json()["result"]


def test_tool_succeeds_with_forwarded_token(client):
    token = create_access_token({"sub": "a@b.com"})
    result = _call_tool(client, {"Authorization": f"Bearer {token}"})
    assert result.get("isError") is not True, result
    assert "a@b.com" in json.dumps(result)


def test_tool_rejected_without_token(client):
    result = _call_tool(client, {})
    assert result.get("isError") is True, result
    assert "401" in json.dumps(result)
