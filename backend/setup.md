# Backend

Run backend project

## Prerequisite

- Docker
- Nodejs

## Setup project

1. Run docker compose

For ubuntu

```
docker-compose up -d
```

For window

```
docker-compose -f .\docker-compose.window.yml up -d
```

2. Install dependencies

```
npm i
```

3. Run prisma migration for each service (will update later to run for all service)

```
nx prisma-migrate auth-service --name=
nx prisma-migrate user-service --name=
```

4. Run necessary services (also update later to run many services in one command)

```
nx serve user-service
nx serve auth-service
```

or run all service

```
nx run-many -t serve --exclude sample-service --parallel=4
```
