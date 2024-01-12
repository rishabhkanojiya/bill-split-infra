Project README

## Project Overview

This project aims to explore Kubernetes and microservices in the backend. It is divided into two main components: the client-side and the server-side. The structure of the project includes configurations for development, production, and staging environments.

## Folder Structure

```
+---client
|   +---config
|   +---public
|   +---src
+---infra
|   +---compose
|   +---Dockerfiles
|   +---k8s
|   |   +---common
|   |   +---dev
|   |   +---prod
|   |   +---server
|   +---skaffold
+---server
|   +---.vscode
|   +---app
|   |   ...
|   |   +---cron
|   |   +---queues
|   |   +---routes
|   |   +---services
|   |   +---swagger
|   |   +---utils
|   |   +---workers
|   +---connections
|   +---db
```

## Client

The client folder contains the frontend code. Notable directories and files include:

- **config:** Webpack configuration files for different environments.
- **public:** Public assets and HTML files.
- **src:** Source code organized into components, constants, context, guards, hooks, routes, and services.

## Infra

The infra folder includes configurations for deployment and orchestration:

- **compose:** Docker Compose configurations for development and production.
- **Dockerfiles:** Dockerfiles for different components of the system.
- **k8s:** Kubernetes manifests for various environments.

## Server

The server folder contains the backend logic. Key directories and files are:

- **.vscode:** Visual Studio Code configurations.
- **app:** Server-side application logic organized into common, consumer, cron, handler, middlewares, models, queues, routes, services, swagger, and utils.
- **connections:** Initialization scripts for Kafka, PostgreSQL, and Redis.
- **db:** Database-related files, including migrations.
- **scripts:** Shell scripts for running the server in different environments.
- **spec:** Testing specifications and utilities.
- **tools:** Tools related to code coverage.

## Getting Started

To get started with the project, follow these steps:

1. **Client Setup:**
   - Navigate to the `client` folder.
   - Install dependencies using `npm install` or `yarn install`.
   - Follow the instructions in the client's README for further setup.
2. **Server Setup:**
   - Navigate to the `server` folder.
   - Install dependencies using `npm install` or `yarn install`.
   - Set up the database by running migrations using `npm run migrate` or `yarn migrate`.
   - Follow the instructions in the server's README for further setup.
3. **Infrastructure Setup:**
   - Navigate to the `infra/skaffold` folder.
   - Follow the instructions in the infra's README for setting up Docker and Kubernetes.
   - `skaffold run -p dev` for running in development mode
   - `skaffold run -p prod` for running in production mode
