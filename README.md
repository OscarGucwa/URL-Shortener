# snip. — URL Shortener

A URL shortener built with React, Node/Express, PostgreSQL, and Redis.
Designed as a DevOps learning project.

## Stack
- **Frontend**: React + TypeScript + Vite (served by Nginx in production)
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis

## Running Locally (with Docker)

The fastest way to run everything:

```bash
docker compose up --build
```

Then open http://localhost:3000

## Running Locally (without Docker)

You'll need PostgreSQL and Redis running locally first.

**Backend:**
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Project Structure

```
url-shortener/
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── App.tsx         # Main component
│   │   ├── api/            # API helper functions
│   │   └── types/          # Shared TypeScript types
│   ├── Dockerfile
│   └── nginx.conf          # Production web server config
├── backend/                # Node + Express + TypeScript
│   ├── src/
│   │   ├── index.ts        # Entry point
│   │   ├── routes/urls.ts  # API routes
│   │   ├── db/             # PostgreSQL connection
│   │   └── cache/          # Redis connection
│   └── Dockerfile
└── docker-compose.yml      # Runs all 4 services
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/shorten | Create a short URL |
| GET | /api/urls | List all URLs |
| GET | /:shortCode | Redirect to original URL |

## DevOps Learning Path

This project is designed to grow with you:

1. ✅ **Phase 1** — Docker Compose (you are here)
2. ⬜ **Phase 2** — CI/CD with GitHub Actions
3. ⬜ **Phase 3** — Deploy to AWS EC2
4. ⬜ **Phase 4** — Infrastructure as Code with Terraform
5. ⬜ **Phase 5** — Kubernetes deployment
6. ⬜ **Phase 6** — Monitoring with Prometheus + Grafana
