# Marketplace Project

This project demonstrates a modern microservices architecture using [NestJS](https://nestjs.com/), [RabbitMQ](https://www.rabbitmq.com/), and [MongoDB](https://www.mongodb.com/) within a monorepo powered by [Turborepo](https://turbo.build/). It follows an **API-First** approach and leverages a shared package for schemas, DTOs, and messaging configurations.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Key Technologies & Libraries](#key-technologies--libraries)
- [Monorepo & Turborepo Justification](#monorepo--turborepo-justification)
- [Getting Started](#getting-started)
- [Development Scripts](#development-scripts)
- [Docker & Local Infrastructure](#docker--local-infrastructure)
- [Testing Strategy](#testing-strategy)

---

## Project Structure

> * apps/
>   * invoices-api/ # Microservice for invoices
>   * orders-api/ # Microservice for orders
> * packages/
>   * shared/ # Shared Mongo schemas, DTOs, RabbitMQ config, etc.
> * docker-compose.yml
> * turbo.json
> * README.md

---

## Key Technologies & Libraries

- **[NestJS](https://nestjs.com/):** Main framework for building scalable server-side applications.
- **Microservices:** Built-in support via `@nestjs/microservices`.
- **RabbitMQ:** Asynchronous communication between services (via `amqplib` and `amqp-connection-manager`).
- **MongoDB:** Database for each microservice (`mongoose`).
- **Swagger/OpenAPI:** API documentation (`@nestjs/swagger`).
- **TypeScript:** Strong typing and modern JavaScript features.
- **Turbo (Turborepo):** Monorepo management, task orchestration, and caching.
- **Jest:** Unit and integration testing.
- **Supertest:** End-to-end API testing.
- **ESLint & Prettier:** Code quality and formatting.
- **js-yaml:** YAML parsing for contract or config files.

---

## Monorepo & Turborepo Justification

- **Why a Monorepo?**  
  Managing multiple microservices and shared code in a single repository simplifies dependency management, code sharing, and consistent tooling.
- **Why Turborepo?**  
  Turbo offers fast, intelligent task orchestration and caching. It outperforms alternatives like Lerna, Nx, or Yarn Workspaces for projects focused on backend microservices, providing:
    - Incremental builds and tests
    - Easy dependency graph management
    - Unified scripts and configuration
- **API-First:**  
  Contracts (OpenAPI YAML) are defined first, ensuring consistency and clear communication between teams/services.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### Install Dependencies

```shell
npm install
```

### Start Local Infrastructure

```shell
docker-compose up -d
```

- **MongoDB:** Exposed on `localhost:27018`
- **RabbitMQ:** AMQP on `localhost:5672`, management UI on `localhost:15672`

---

## Development Scripts

All scripts are run via [Turbo](https://turbo.build/):

| Script                  | Description                      |
|-------------------------|----------------------------------|
| `npx turbo run dev`     | Start all microservices in dev mode |
| `npx turbo run test`    | Run all unit tests               |
| `npx turbo run test:e2e`| Run all end-to-end tests         |
| `npx turbo run lint`    | Lint all code                    |
| `npx turbo run build`   | Build all apps and packages      |

---

## Docker & Local Infrastructure

**`docker-compose.yml`** sets up MongoDB and RabbitMQ for local development:


---

## Testing Strategy

- **Unit Tests:**  
  Written with Jest, covering individual services and logic.
- **Integration & E2E Tests:**  
  Use Supertest to simulate API requests and test service integration. (Not finished)
- **Contract Testing:**  
  OpenAPI YAML files are used to validate API structure and ensure compatibility.
- **Run all tests:**  

```shell
npx turbo run test
npx turbo run test:e2e
```


---

## Extending the Project

- Add new microservices under `apps/`.
- Share code (DTOs, schemas, utilities) via `packages/shared`.
- Define new contracts in YAML and validate with tools like Spectral or Dredd.
- Update the `turbo.json` to orchestrate new tasks as needed.

---

## License

MIT

---

**Happy coding! 🚀**
