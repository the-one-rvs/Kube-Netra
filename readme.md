# 🚀 Kube-Netra

Kube-Netra is an ambitious platform for **automated CI/CD, environment management, and DevOps orchestration** built for modern cloud-native teams.  
It brings together **Docker, GitHub, Kubernetes, and custom Bash automation** into a single, extensible backend—making it easy to manage projects, environments, and workflows at scale.

---

## 🤯 Why Kube-Netra is Insane

- **End-to-End Automation:**  
  From Docker image watching to GitHub Helm chart patching, everything is automated with robust Bash scripts and Node.js orchestration.

- **Dynamic Environment Generation:**  
  Instantly generate, patch, and manage multiple environments (dev, test, prod, etc.) for any project—no manual YAML wrangling.

- **Live Workflow & Log Streaming:**  
  Watch your workflow, watcher, and patcher logs in real time via the API.

- **Role-Based Access & Permissions:**  
  Fine-grained user roles and permissions, including admin, project, environment, and core workflow access.

- **Secure GitHub PAT & DockerHub Integration:**  
  Manage and inject secrets securely for private/public images and repositories.

- **Kubernetes-Ready:**  
  Designed to plug into your K8s clusters and automate Helm chart updates as soon as new Docker tags are published.

- **Scriptable Core:**  
  All core logic is open Bash—inspect, extend, or hack it as you wish.

- **Swagger API Docs:**  
  Full OpenAPI documentation for every endpoint.

---

## 🏗️ Project Structure

```
Kube-Netra__WEB/
  readme.md
  API/
    .env
    package.json
    core/         # Bash scripts: workflow, patchers, watchers, etc.
    docs/         # Swagger/OpenAPI docs
    src/          # Node.js backend (controllers, models, routes, utils)
```

---

## 🛠️ What You Can Do (Already!)

- Register users, assign roles, and manage permissions
- Create projects and environments (auto/manual/dual modes)
- Add GitHub Personal Access Tokens and DockerHub credentials
- Trigger, monitor, and stop CI/CD workflows
- Stream logs for every part of the pipeline
- Patch Helm charts automatically or manually when new Docker tags appear

---

## 🚧 What's Next

We're still **actively building** Kube-Netra!  
A beautiful **frontend dashboard** is coming soon, making all these features accessible with just a few clicks.

---

## 📚 API Documentation

- Interactive Swagger UI: [http://localhost:8000/api-docs](http://localhost:8000/api-docs)
- OpenAPI spec: [`API/docs/swagger.yaml`](API/docs/swagger.yaml)

---

## 🤝 Contributing

Want to help?  
Open an issue, suggest a feature, or fork and PR!  
We're especially interested in feedback from DevOps engineers and Kubernetes power users.

---

## 📝 License

MIT License © Quasar Celestio

---

> **Kube-Netra** — The DevOps automation platform you always wished existed.  
> _Stay tuned for