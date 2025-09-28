# 🚀 Kube-Netra

Kube-Netra is a full-stack platform for **Kubernetes release management, CI/CD automation, and DevOps orchestration**.  
It brings together a powerful backend (Node.js, MongoDB, Bash, Docker, GitHub, Kubernetes) and a modern frontend (React, Vite, Tailwind) to help teams ship software faster, safer, and smarter.

---

## 🤯 Why Kube-Netra is Insane

- **End-to-End Automation:**  
  Watches Docker registries, patches Helm charts, and promotes releases across environments—automatically.

- **Dynamic Environment Management:**  
  Create, patch, and manage multiple environments (dev, test, prod, etc.) for any project, with just a few clicks.

- **Live Log Streaming:**  
  See workflow, watcher, and patcher logs in real time—directly in the dashboard.

- **Role-Based Access & Permissions:**  
  Granular IAM for users, projects, environments, and core workflows.

- **Secure GitHub PAT & DockerHub Integration:**  
  Manage secrets for private/public images and repositories.

- **Kubernetes-Ready:**  
  Designed to automate Helm chart updates and deployments in your K8s clusters.

- **Scriptable Core:**  
  All automation logic is open Bash—inspect, extend, or hack it as you wish.

- **Swagger API Docs:**  
  Full OpenAPI documentation for every backend endpoint.

- **Modern UI:**  
  Fast, beautiful, and permission-driven frontend built with React, Vite, and Tailwind CSS.

---

## 🏗️ Project Structure

```
Kube-Netra__WEB/
  docker-compose.yaml
  readme.md
  API/
    .env
    Dockerfile
    entrypoint.sh
    package.json
    core/         # Bash scripts: workflow, patchers, watchers, etc.
    docs/         # Swagger/OpenAPI docs
    src/          # Node.js backend (controllers, models, routes, utils)
  Frontend/
    .env
    Dockerfile
    package.json
    vite.config.js
    nginx/
    public/
    src/          # React frontend (components, pages, features, store)
```

---

## ⚡ Getting Started

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd Kube-Netra__WEB
   ```

2. **Configure environment variables:**  
   - Copy `API/.env.example` to `API/.env` and fill in the required values.
   - Copy `Frontend/.env.example` to `Frontend/.env` and set your backend API URL.

3. **Build Docker images:**
   ```sh
   docker compose build
   ```

4. **Run the stack:**
   ```sh
   docker compose up -d
   ```
   - Backend: [http://localhost:8000](http://localhost:8000)
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Swagger API Docs: [http://localhost:8000/api-docs](http://localhost:8000/api-docs)

---

## 🛠️ Features

- **User Management:** Register, login, assign roles, and manage permissions.
- **Projects:** Create, update, favorite, and manage Kubernetes projects.
- **Environments:** Add, edit, and delete environments for each project.
- **PATs:** Add GitHub Personal Access Tokens and link them to projects.
- **Team:** Invite, update, and remove team members. Assign permissions.
- **Logs:** View live logs for workflows, watchers, and patchers.
- **Profile:** Edit profile, change password, and logout securely.

---

## 🚧 Work In Progress

We’re actively building new features and polishing the UI.  
**Frontend dashboard is evolving fast—expect new charts, dashboards, and more!**

---

## 🔗 Documentation

- **Backend API Docs:** [`API/docs/swagger.yaml`](API/docs/swagger.yaml)
- **Frontend Docs:** [`Frontend/README.md`](Frontend/README.md)
- **Backend Docs:** [`API/readme.md`](API/readme.md)

---


> **Kube-Netra** — Ship smarter, automate everything, and manage your cloud-native team like a pro!