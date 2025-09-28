# 🚀 Kube-Netra Frontend

This is the **React + Vite** frontend for [Kube-Netra](../API/readme.md), your intelligent Kubernetes release manager and DevOps automation platform.

---

## 🤩 What Makes Kube-Netra Insane?

- **Live Project & Environment Management:**  
  Create, update, and monitor Kubernetes projects and environments with a few clicks.

- **GitHub PAT Integration:**  
  Securely manage Personal Access Tokens and link them to projects.

- **Team & Permissions:**  
  Invite team members, assign granular permissions, and manage roles with ease.

- **Real-Time Logs:**  
  Stream workflow, watcher, and patcher logs directly in the dashboard.

- **IAM Embedded:**  
  Highly permission-driven UI—if a button doesn’t work, ask your admin for access!

- **Modern UI:**  
  Built with React, Vite, Tailwind CSS, and Lucide icons for a fast, beautiful experience.

---

## 🏗️ Project Structure

```
Frontend/
  src/
    components/      # Reusable UI components
    features/        # Redux slices & async logic
    pages/           # Main screens (Home, Projects, Team, PAT, etc.)
    app/             # Redux store
    routes/          # AppRoutes for navigation
    index.css        # Tailwind styles
    main.jsx         # App entry point
  public/
  package.json
  vite.config.js
  .env
  README.md
```

---

## ⚡ Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure API URL:**  
   Set your backend API URL in `.env`:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

3. **Run the frontend:**
   ```sh
   npm run dev
   ```
   Visit [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Features

- **Projects:** Create, update, favorite, and manage Kubernetes projects.
- **Environments:** Add, edit, and delete environments for each project.
- **PATs:** Add GitHub Personal Access Tokens and link them to projects.
- **Team:** Invite, update, and remove team members. Assign permissions.
- **Logs:** View live logs for workflows, watchers, and patchers.
- **Profile:** Edit profile, change password, and logout securely.

---

## 🚧 Work In Progress

We’re actively building new features and polishing the UI.  
**Frontend is evolving fast—expect new dashboards, charts, and more!**

---

## 🔗 API Docs

See [API/readme.md](../API/readme.md) and [API/docs/swagger.yaml](../API/docs/swagger.yaml) for backend endpoints.

---



---

> **Kube-Netra** — Ship smarter, automate everything, and manage your cloud-native team like a pro!