# backend

*all commands must be executed in the ./backend folder*

### run dev
```sh
cp .env.dev.example .env
docker compose -f compose.dev.yaml up -d
npm install
npm run db:push
npm run start:dev
```

### stack

* Nestjs
* Drizzle
* Docker/Compose
* Postgres
* Caddy
* Cloudflare


### Endpoints

Base URL: `https://api.challenge.smallauncher.com/tasks` | `http://localhost:3000/tasks`

---

- `POST /tasks` — Create a new task
- `GET /tasks` — Get all tasks (supports `skip` and `limit` query params)
- `GET /tasks/count` — Get count of tasks by priority (supports `startDate`, `endDate`, `priority` query params)
- `GET /tasks/statistic` — Get statistics of tasks by day (supports `startDate`, `endDate`, `priority` query params)
- `GET /tasks/:id` — Get a task by ID
- `PATCH /tasks/:id` — Update a task by ID
- `DELETE /tasks/:id` — Delete a task by ID
