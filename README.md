# social-network

Pet project built to learn microservices architecture

## Project structure of each microservice

Example with sample service, each service contains 1 or more modules, each module is correspoding to 1 aggregate. In each module, it will be divided into 4 layer

- api
- application
- domain
- infrastructure

### Domain layer

This layer contains the application's business rules.

- entities, aggregate root
- domain events
- value objects
- domain errors
- types
- ports

### Application layer

This layer contains

- command handler: used for state-changing actions
- queries handler: is retrieval operation and should not make any state changes
- event handler: handle event that is publish from other part of a service
- dtos

### Infrastructure layer

This layer is responsible for encapsulating technology, including implementations of database repositories for storing/retrieving business entities, message brokers to emit messages/events, I/O services to access external resources, framework related code and any other code that represents a replaceable detail for the architecture.

### Api

This layer prodives

- Http controller to handle http request from user
- Message controller to handle message command from other service
- Event controller to handle event that it subcribes

## Running sample service

in backend folder, to install all dependencies run

```
npm i
```

run docker compose to setup mysql database

```
docker compose up
```

init migration by prisma, (run sql file to generate prisma client and syncronize database)

```
npx prisma migrate dev --schema=./prisma/sample/schema.prisma
```

run sample service

```
nx serve sample-service
```
