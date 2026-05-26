# Job Assistant

An AI-powered job search and application tracking platform. Upload your CV, search live job listings, get an instant AI match score, generate tailored cover letters, and track every application — all in one place.

---

## Features

- **CV Upload & Analysis** — Upload PDF or DOCX; Gemini AI extracts skills, experience, and education
- **Live Job Search** — Searches the [Arbeitnow](https://www.arbeitnow.com/) job board API across up to 5 pages (~100 results), deduplicated and relevance-ranked
- **AI CV Matching** — Hybrid scoring: BGE embedding cosine similarity (40%) + LLM skill-overlap analysis (60%), with in-process caching to skip redundant LLM calls
- **Cover Letter Generation** — One-click AI-generated cover letter, editable in-place, copyable to clipboard
- **Application Tracking** — Save jobs, track status (Applied → Interviewing → Offered → Rejected), add notes
- **MCP Server** — All FastAPI routes exposed as MCP tools via `fastapi-mcp`, mountable at `/mcp`
- **Demo Mode** — Toggle `DEMO_MODE=true` to serve canned responses instantly (no API key needed for demos)
- **Security hardened** — Rate limiting, bcrypt passwords, JWT auth, magic-byte file validation, security headers, CORS restriction

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite 8 |
| Backend | FastAPI, SQLAlchemy, Alembic, Uvicorn |
| AI | Google Gemini 2.5 Flash (`google-genai`) |
| Embeddings | `fastembed` with `BAAI/bge-small-en-v1.5` |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (`python-jose`), bcrypt |
| Rate Limiting | `slowapi` |
| MCP | `fastapi-mcp`, `mcp[cli]` |
| CV Parsing | PyPDF2, python-docx |
| ML | scikit-learn, spaCy (`en_core_web_sm`) |

---

## Project Structure

```
job-assistant/
├── backend/
│   ├── api/
│   │   ├── auth.py          # Register / login, JWT issuance
│   │   ├── cv.py            # CV upload, analysis, delete
│   │   ├── jobs.py          # Job search, CV matching, cover letter
│   │   ├── applications.py  # Application CRUD
│   │   └── users.py         # Current user info
│   ├── db/
│   │   ├── database.py      # SQLAlchemy engine + session
│   │   └── models.py        # User, CV, Joblisting, Application
│   ├── ml/
│   │   ├── llm_service.py   # Gemini API wrapper with retry logic
│   │   ├── cv_parser.py     # CV text cleaning + LLM extraction
│   │   ├── job_matcher.py   # Hybrid embedding + LLM match scoring
│   │   ├── cover_letter.py  # Cover letter prompt + generation
│   │   └── demo_responses.py # Canned responses for demo mode
│   ├── mcp_server/          # MCP server configuration
│   ├── main.py              # FastAPI app, middleware, MCP mount
│   └── pyproject.toml
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx      # Public landing page
    │   │   ├── Dashboard.jsx    # CV upload & analysis
    │   │   ├── Jobs.jsx         # Job search + matching + cover letter
    │   │   └── Applications.jsx # Application tracker
    │   ├── components/
    │   │   ├── Layout.jsx       # Sidebar navigation shell
    │   │   ├── Navbar.jsx
    │   │   ├── LoginForm.jsx
    │   │   └── RegisterForm.jsx
    │   ├── api.js               # All fetch calls to the backend
    │   └── App.jsx              # Routes + ProtectedRoute wrapper
    └── package.json
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- A [Supabase](https://supabase.com/) project (PostgreSQL)
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)

### Backend

```bash
cd backend

# Install dependencies
uv sync

# Configure environment
cp .env.example .env
# Edit .env — see Environment Variables section below

# Run the development server
uv run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create `backend/.env` with the following:

```env
# Database (Supabase PostgreSQL connection string)
DATABASE_URL=postgresql://postgres:<password>@<host>:5432/postgres

# Google Gemini API key
JOB_ASSISTANT_GEMINI_API_KEY=your_gemini_api_key_here

# JWT secret — generate a strong random string
SECRET_KEY=your_secret_key_here

# Demo mode — set to true to use canned responses (no Gemini key needed)
DEMO_MODE=false
```

> **Note:** The app will refuse to start if `SECRET_KEY` is not set.

---

## API Overview

All endpoints are prefixed as shown. Authentication uses `Bearer <token>` in the `Authorization` header.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Register a new user |
| `POST` | `/auth/login` | No | Login, returns JWT |
| `GET` | `/users/me` | Yes | Current user profile |
| `POST` | `/cv/upload` | Yes | Upload PDF or DOCX CV |
| `POST` | `/cv/analyze` | Yes | Extract skills / experience via Gemini |
| `GET` | `/cv/get` | Yes | Retrieve current CV metadata |
| `DELETE` | `/cv/delete` | Yes | Delete CV |
| `GET` | `/jobs/search` | Yes | Search live job listings |
| `POST` | `/jobs/match` | Yes | Match uploaded CV against a job description |
| `POST` | `/jobs/cover-letter` | Yes | Generate a cover letter for a job |
| `POST` | `/jobs/save` | Yes | Save a job listing to the database |
| `GET` | `/applications/get` | Yes | List tracked applications |
| `POST` | `/applications/create` | Yes | Create a new application |
| `PATCH` | `/applications/{id}` | Yes | Update application status / notes |
| `DELETE` | `/applications/{id}` | Yes | Delete an application |
| `GET` | `/health` | No | Health check |

---

## How Matching Works

The CV-to-job match score is a **hybrid of two signals**:

1. **Semantic similarity (40%)** — BGE embeddings (`BAAI/bge-small-en-v1.5`) compare CV text against the cleaned job description using cosine similarity. Scores are normalized to 0–100.

2. **Skill overlap (60%)** — Gemini identifies which of the candidate's extracted skills match the job requirements and which are missing. The ratio of matching to total skills produces a second score.

The final score is `0.4 × cosine + 0.6 × skill_overlap`. Results are cached in-process (keyed by MD5 of skills + job description) to avoid redundant LLM calls within a session.

---

## MCP Integration

The backend exposes all FastAPI routes as MCP tools via [fastapi-mcp](https://github.com/tadata-ru/fastapi-mcp), mounted at `/mcp`.

To connect from an MCP-compatible client (e.g. Claude Desktop):

```json
{
  "mcpServers": {
    "job-assistant": {
      "url": "http://localhost:8000/mcp"
    }
  }
}
```

This lets AI assistants call job search, CV matching, and application tracking tools directly.

---

## Demo Mode

Set `DEMO_MODE=true` in `.env` to run without a Gemini API key. All AI endpoints return realistic canned responses defined in `backend/ml/demo_responses.py` with a simulated 1–2 second delay. Useful for interviews, demos, and local development.

---

## Security

- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with configurable expiry; `SECRET_KEY` is required at startup
- File uploads validated by size (5 MB limit) and magic bytes (not just extension)
- Job search query and location inputs capped at 100 characters
- Rate limiting via `slowapi`
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`
- CORS restricted to `http://localhost:5173` in development
- Gemini error messages sanitized — internal details are never surfaced to clients

---

## License

MIT
