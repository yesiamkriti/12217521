# ⚡ URL Shortener Microservice (Fullstack)

A lightweight fullstack microservice-based URL Shortener with analytics.

---

## 🔧 Features

- Shorten long URLs with optional custom shortcode
- Set validity duration (default 30 minutes)
- Track number of clicks, referrer, and geolocation
- View analytics for each shortened URL
- Built using:
  - Node.js + Express + MongoDB (Backend)
  - React + Native CSS (Frontend)
  - Custom Logging Middleware (No console.log)
- Dockerized for easy deployment

---

## 🚀 Getting Started (via Docker)

### 🛠 Prerequisites

- Docker + Docker Compose

### 🔄 Run the App

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
docker-compose up --build
```

Frontend: http://localhost:3000

Backend API: http://localhost:5000

## 📦 Directory Structure

.
├── url-shortener-backend/ # Node.js + Express + TypeScript
├── url-shortener-frontend/ # React + HTML/CSS
├── docker-compose.yml
└── README.md

## 👤 Author

---

## ✅ Deployment Complete!

You now have:

- 🐳 Lightweight backend & frontend containers
- ✅ Analytics UI with session-based tracking
- 📝 Complete README for GitHub or deployment

---

Would you like help with:

- 📤 Deploying to a live server (like **Render**, **Railway**, **Fly.io**, or **VPS**)?
- 📥 Pushing this to GitHub with `.dockerignore`, `.env`, etc.?
- 🔐 Securing access (rate limits, token auth)?

Let me know what to do next!
