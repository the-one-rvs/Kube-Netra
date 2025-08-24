# Kube-Netra API

This is the backend API for Kube-Netra, a platform for managing projects, environments, users, and CI/CD workflows with Docker, GitHub, and Kubernetes.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Main Endpoints](#main-endpoints)
- [Development](#development)
- [License](#license)

---

## Features

- User authentication (JWT, cookies)
- Role-based permissions
- Project and environment management
- GitHub PAT integration
- Docker image validation (public/private)
- Core workflow orchestration (Bash scripts)
- Swagger API documentation

---

## Project Structure

```
API/
  core/           # Bash scripts for workflow, patchers, watchers, etc.
  docs/           # Swagger/OpenAPI documentation
  src/
    controller/   # Express controllers
    db/           # Database connection
    middleware/   # Express middlewares
    models/       # Mongoose models
    routes/       # Express routes
    utils/        # Utility functions
  .env            # Environment variables
  package.json    # NPM dependencies and scripts
  readme.md       # This file
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database
- (Optional) Docker for running patchers/watchers

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd API
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` and fill in the required values (see below).

4. Start the server:
   ```sh
   npm start
   ```

---

## Environment Variables

Create a `.env` file in the `API/` directory with the following keys:

```
MONGODB_URI=your_mongodb_uri
PORT=8000
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
PROJECT_TOKEN_SECRET=your_project_token_secret
PROJECT_TOKEN_EXPIRY=1d
NODE_ENV=dev
PROJECT_DETAILS_URL=http://localhost:8000/api/v1/callCore/getAllDetails
```

---

## API Documentation

Interactive API docs are available via Swagger UI:

- Start the server
- Visit: [http://localhost:8000/api-docs](http://localhost:8000/api-docs)

The OpenAPI spec is in [`docs/swagger.yaml`](docs/swagger.yaml).

---

## Main Endpoints

### User

- `POST   /api/v1/users/createRootAdmin`
- `POST   /api/v1/users/register`
- `POST   /api/v1/users/login`
- `GET    /api/v1/users/logout`
- `GET    /api/v1/users/currentUser`
- `GET    /api/v1/users/allUsers`
- `PATCH  /api/v1/users/updateUserDetails`
- `PATCH  /api/v1/users/changePassword`
- `DELETE /api/v1/users/deleteUser`
- `GET    /api/v1/users/getPermission`
- `POST   /api/v1/users/addPermission`
- `POST   /api/v1/users/removePermission`

### Project

- `POST   /api/v1/project/createProject`
- `GET    /api/v1/project/enterProject/:projectId`
- `GET    /api/v1/project/exitProject`
- `PATCH  /api/v1/project/updateProject`
- `DELETE /api/v1/project/deleteProject`
- `GET    /api/v1/project/getCurrentProjectDetails`
- `GET    /api/v1/project/getAllProjects`

### Environment

- `POST   /api/v1/environment/createEnvironment`
- `GET    /api/v1/environment/getEnvironment/:projectId/:environmentNumber`
- `PATCH  /api/v1/environment/updateEnvironment/:environmentId`
- `GET    /api/v1/environment/getAllEnvironment`
- `DELETE /api/v1/environment/deleteEnvironment/:environmentId`

### PAT (Personal Access Token)

- `POST   /api/v1/pat/addGithubPAT`
- `GET    /api/v1/pat/showPATProjects`
- `POST   /api/v1/pat/addPATinProject`
- `DELETE /api/v1/pat/deletePAT`

### Core/Workflow

- `GET    /api/v1/callCore/startWorkflow`
- `GET    /api/v1/callCore/stopWorkflow`
- `GET    /api/v1/callCore/logs/workflow`
- `GET    /api/v1/callCore/logs/watcher`
- `GET    /api/v1/callCore/logs/patcher/:envId`
- `GET    /api/v1/callCore/logsCleaner`
- `GET    /api/v1/callCore/startManualPatcher/:environmentId`

---

## Development

- Use [src/app.js](src/app.js) as the main Express app.
- All routes are under `/api/v1/`.
- Core workflow scripts are in [core/](core/).
- For API changes, update [`docs/swagger.yaml`](docs/swagger.yaml).

---

## License

MIT License ©