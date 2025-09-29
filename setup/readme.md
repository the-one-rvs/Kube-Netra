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
   git clone <repo-url>
   cd Kube-Netra__WEB/setup
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