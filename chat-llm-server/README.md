### ChatLLM: Backend

This project is the backend part of a chat application built with NestJS. It handles real-time messaging logic and interactions with PostgreSQL and Redis.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes.

### Prerequisites

- Node.js and npm (Node.js 14+ is recommended)
- Docker and Docker Compose for running PostgreSQL and Redis
- NestJS CLI

```bash
npm install -g @nestjs/cli
```

## Deploy in dev

### Install dependencies

```bash
npm install
```

### Set environment

Copy `environment.template.ts` into `environment.ts`.
In dev mode, you won't need to change any properties.

### Deploy Redis and PostgreSQL (mandatory)

```bash
docker compose up -d
```

### Deploy backend

```bash
npm start
```

## Deploy in prod

Not yet implemented !
