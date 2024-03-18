# ChatLLM

This project is a chat application to converse with a LLM.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes.

### Prerequisites

- Node.js and npm (Node.js 20+ is recommended)
- Angular CLI
- Docker and Docker Compose for running PostgreSQL and Redis
- NestJS CLI

```bash
npm install -g @angular/cli
```

```bash
npm install -g @nestjs/cli
```

## Deploy in dev

### Install dependencies

From root:

```bash
cd chat-llm-client
npm install
```

```bash
cd chat-llm-server
npm install
```

### Set environment

Copy `chat-llm-server/src/environment.template.ts` to `chat-llm-server/src/environment.ts`.
In dev mode, you won't need to change any properties.

### Deploy Redis and PostgreSQL (mandatory)

```bash
cd chat-llm-server
docker compose up -d
```

### Deploy

From root:

```bash
cd chat-llm-client
npm start
```

```bash
cd chat-llm-server
npm start
```

## Deploy in prod

Not yet implemented !
