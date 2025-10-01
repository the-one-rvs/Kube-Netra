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
├── API
    ├── .dockerignore
    ├── .env.sample
    ├── .gitignore
    ├── Dockerfile
    ├── core
    │   ├── .dockerignore
    │   ├── .gitignore
    │   ├── cleanup.sh
    │   ├── environment-genrator.sh
    │   ├── install.sh
    │   ├── kube-netra
    │   ├── logo
    │   │   └── KubeNetra Logo Design.png
    │   ├── patcher
    │   │   ├── auto-patcher.sh
    │   │   ├── dual-patcher.sh
    │   │   └── manual-patcher.sh
    │   ├── watcher-genrator.sh
    │   └── workflow.sh
    ├── docs
    │   └── swagger.yaml
    ├── entrypoint.sh
    ├── package-lock.json
    ├── package.json
    ├── readme.md
    └── src
    │   ├── app.js
    │   ├── constants.js
    │   ├── controller
    │       ├── coreCaller.controller.js
    │       ├── environment.controller.js
    │       ├── pat.controller.js
    │       ├── permissions.controller.js
    │       ├── project.controller.js
    │       ├── querySupport.controller.js
    │       └── user.controller.js
    │   ├── db
    │       └── connectDB.js
    │   ├── index.js
    │   ├── middleware
    │       ├── auth.middleware.js
    │       ├── checkDockerImage.middleware.js
    │       ├── checkGitHubRepo.middleware.js
    │       ├── checkforPAT.middleware.js
    │       ├── errorHandler.middleware.js
    │       ├── project.middleware.js
    │       ├── requestLogger.middleware.js
    │       └── requirePermissions.middleware.js
    │   ├── models
    │       ├── env.model.js
    │       ├── githubPAT.model.js
    │       ├── patPermission.model.js
    │       ├── project.model.js
    │       ├── projectPermissions.model.js
    │       └── user.model.js
    │   ├── routes
    │       ├── callCore.routes.js
    │       ├── environment.routes.js
    │       ├── mail.routes.js
    │       ├── pat.routes.js
    │       ├── project.routes.js
    │       └── user.routes.js
    │   └── utils
    │       ├── ApiError.js
    │       ├── ApiResponse.js
    │       ├── asyncHandler.js
    │       ├── logger.js
    │       ├── permissions.js
    │       ├── queryMailer.js
    │       └── validator.js
├── Frontend
    ├── .dockerignore
    ├── .env
    ├── .env.sample
    ├── .gitignore
    ├── Dockerfile
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── nginx
    │   ├── default.conf
    │   └── entrypoint.sh
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── architecture.png
    │   ├── bg-auth.jpg
    │   ├── bg-green.png
    │   ├── bg-red.jpg
    │   ├── bg-yellow.jpg
    │   ├── logo.png
    │   └── vite.svg
    ├── src
    │   ├── App.jsx
    │   ├── app
    │   │   └── store.js
    │   ├── assets
    │   │   └── react.svg
    │   ├── components
    │   │   ├── EnvironmentList.jsx
    │   │   ├── FeatureCard.jsx
    │   │   ├── LogsSection.jsx
    │   │   ├── MemberCard.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PATCard.jsx
    │   │   ├── PATFilteredProjectCard.jsx
    │   │   ├── PATNavbar.jsx
    │   │   ├── PATPageNavbar.jsx
    │   │   ├── PATProjectCard.jsx
    │   │   ├── ProfileMenu.jsx
    │   │   ├── ProjectCard.jsx
    │   │   ├── ProjectNavbar.jsx
    │   │   ├── ProjectPageNavbar.jsx
    │   │   ├── ProjectStatusCard.jsx
    │   │   └── TeamNavbar.jsx
    │   ├── features
    │   │   ├── PAT
    │   │   │   ├── patPageSlice.js
    │   │   │   └── patSlice.js
    │   │   ├── auth
    │   │   │   └── authSlice.js
    │   │   ├── environments
    │   │   │   └── environmentSlice.js
    │   │   ├── projects
    │   │   │   ├── projectOpSlice.js
    │   │   │   ├── projectPageSlice.js
    │   │   │   └── projectSlice.js
    │   │   ├── query
    │   │   │   └── querySlice.js
    │   │   └── user
    │   │   │   ├── changePasswordSlice.js
    │   │   │   ├── currentUserSlice.js
    │   │   │   ├── editProfileSlice.js
    │   │   │   └── teamSlice.js
    │   ├── index.css
    │   ├── main.jsx
    │   ├── pages
    │   │   ├── Auth
    │   │   │   ├── Login.jsx
    │   │   │   └── RegisterAdmin.jsx
    │   │   ├── Environment
    │   │   │   ├── CreateEnvironment.jsx
    │   │   │   └── UpdateEnvironment.jsx
    │   │   ├── Home
    │   │   │   ├── Home.jsx
    │   │   │   └── Landing.jsx
    │   │   ├── PAT
    │   │   │   ├── AddPAT.jsx
    │   │   │   ├── PATFilteredProjects.jsx
    │   │   │   ├── PATHome.jsx
    │   │   │   └── PATPage.jsx
    │   │   ├── Project
    │   │   │   ├── CreateProject.jsx
    │   │   │   ├── ProjectHome.jsx
    │   │   │   ├── ProjectPage.jsx
    │   │   │   └── UpdateProject.jsx
    │   │   ├── Team
    │   │   │   ├── CreateMember.jsx
    │   │   │   ├── ModifyPermissions.jsx
    │   │   │   └── TeamHome.jsx
    │   │   └── User
    │   │   │   ├── ChangePassword.jsx
    │   │   │   └── EditProfile.jsx
    │   ├── routes
    │   │   └── AppRoutes.jsx
    │   └── utils
    │   │   └── axiosInstance.js
    └── vite.config.js
├── readme.md
└── setup
    ├── .env.api.sample.config
    ├── .env.frontend.sample.config
    ├── .gitignore
    ├── docker-compose.yaml
    └── readme.md

```

---



## ⚡ How to create a promotion or realese pipeline

  - Go to project section and add a project with corresponding docker image details 
  - Go to PAT section create a PAT or use exsiting one to add in the project 
  - Go to Project section and go inside your project for creating different environments relative to your helm manifests and   ArgoCD deployment information from helm repository
  - Now, Run the Project and every thing is up you have the logs section ready for you 
  - If a new tag updated in dockerhub registry then you can see the magic happen


## 🛠️ Features

- **User Management:** Register, login, assign roles, and manage permissions.
- **Projects:** Create, update, favorite, and manage Kubernetes projects.
- **Environments:** Add, edit, and delete environments for each project.
- **PATs:** Add GitHub Personal Access Tokens and link them to projects.
- **Team:** Invite, update, and remove team members. Assign permissions.
- **Logs:** View live logs for workflows, watchers, and patchers.
- **Profile:** Edit profile, change password, and logout securely.

---

# 🛠️ Kube-Netra Setup

This folder contains all the configuration and orchestration files needed to run the **Kube-Netra** platform locally or on your server.  
It helps you quickly spin up the full stack (API, Frontend, MongoDB) using Docker Compose and environment configs.

---

## 📦 What's Inside

- `.env.api.sample.config` & `.env.frontend.sample.config`  
  Sample environment variable files for API and Frontend.  
  Copy and rename these to `.env.api.config` and `.env.frontend.config` and fill in your secrets/URLs.

- `docker-compose.yaml`  
  Compose file to run backend, frontend, and MongoDB together.

- `readme.md`  
  This guide.

---

## 🚀 Quick Start

1. **Clone the repo:**
   ```sh
   git clone https://github.com/the-one-rvs/Kube-Netra
   cd Kube-Netra
   cd setup
   ```

2. **Configure environment variables:**
   - Copy `.env.api.sample.config` to `.env.api.config` and fill in your MongoDB URI, secrets, etc.
   - Copy `.env.frontend.sample.config` to `.env.frontend.config` and set your API URL.

3. **Run everything:**
   ```sh
   docker-compose  up -d
   ```

4. **Access the stack:**
   - **Backend API:** [<host-ip>:8000](<host-ip>:8000)
   - **Frontend:** [<host-ip>:5173](<host-ip>:5173)
   - **Swagger Docs:** [<host-ip>:8000/api-docs](<host-ip>:8000/api-docs)
   - **MongoDB:** [<host-ip>:27017](<host-ip>:27017)

---

## 🧩 Customization

- Edit `docker-compose.yaml` to change ports, volumes, or add more services.
- Update `.env.api.config` and `.env.frontend.config` for your environment.

---

## 📝 Notes

- Make sure Docker and Docker Compose are installed.
- For production, use strong secrets and secure your MongoDB.
- You can extend this setup for cloud deployment or CI/CD.

---

> **Kube-Netra** — One command, full stack, ready to automate your Kubernetes releases!

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