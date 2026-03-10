FROM ghcr.io/astral-sh/uv:python3.11-trixie-slim
WORKDIR /app

ENV VIRTUAL_ENV = /app/.venv
ENV PATH = "/app/.venv/bin:$PATH"

#to install application dependencies
COPY pyproject.toml uv.lock ./

RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project

COPY ./ /app/

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked

CMD [ "uv","run","uvicorn","main:app","--host","0.0.0.0","--port","8000" ]