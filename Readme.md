# ⚡ URL Shortener Microservice – Full Stack

A full-stack microservice application to shorten URLs, track analytics, and log structured events using a reusable logging middleware.

---

## 📦 Features

- 🔗 Shortens long URLs with optional custom shortcodes
- ⏳ Set validity duration for short links (default: 30 minutes)
- 📊 Track total clicks with timestamp, referrer, and geolocation
- 📄 View statistics for each shortened URL
- 📜 Reusable logging middleware logs structured events to Affordmed’s test server
- ⚙️ Built using:
  - Backend: Node.js, Express, TypeScript, MongoDB
  - Frontend: React, TypeScript, Vanilla CSS
  - Logging: Centralized `Log()` function used across both backend and frontend

---

## 🧩 Tech Stack

- **Backend**: Node.js, Express, MongoDB (TTL indexing), TypeScript
- **Frontend**: React, TypeScript, Vanilla CSS (no UI frameworks)
- **Logging Middleware**: Custom-built, reusable across backend & frontend
- **Deployment**: Docker, Docker Compose (small multi-stage images)

---

## 🗂️ Folder Structure

/12217521/
├── logging-middleware/ # Shared log utility
│ ├── log.ts
│ ├── config.ts
│ └── test-log.ts
├── backend/ # Express + MongoDB service
│ ├── Dockerfile
│ ├── src/
│ └── ...
├── frontend/ # React app
│ ├── Dockerfile
│ ├── src/
│ └── ...
└── README.md

---

## 🛠️ Getting Started

### Prerequisites

- Docker & Docker Compose installed

---

### 🚀 Run Locally (via Docker Compose)

```bash
git clone https://github.com/YOUR_USERNAME/12217521.git
cd 12217521
docker-compose up --build

```

## Access the App

Frontend: http://localhost:3000

Backend API: http://localhost:5000

🔧 API Endpoints

1. Create Short URL

```bash
POST /shorturls
#Request Body:

{
  "url": "https://example.com/page",
  "validity": 45,
  "shortcode": "mycode123"
}
#Response:

{
  "shortLink": "http://localhost:5000/shorturls/r/mycode123",
  "expiry": "2025-07-14T11:15:00Z"
}
#2. Redirect Short URL

GET /shorturls/r/:shortcode
Redirects to original long URL and logs click data.

#3. Get URL Statistics

GET /shorturls/:shortcode
Response:

{
  "originalUrl": "https://example.com/page",
  "createdAt": "2025-07-14T10:15:00Z",
  "expiresAt": "2025-07-14T11:15:00Z",
  "totalClicks": 2,
  "clicks": [
    {
      "timestamp": "2025-07-14T10:45:00Z",
      "referrer": "Direct",
      "location": "Delhi, India"
    }
  ]
}
```

## 🧾 Logging Middleware

Logs are sent to Affordmed’s log server using:

```bash
Log("frontend", "error", "api", "Invalid payload received");
Fields:

stack: "frontend" or "backend"

level: "debug", "info", "warn", "error", "fatal"

package: "api", "handler", "component", etc.

message: Descriptive event message
```

# Endpoint:

POST http://20.244.56.144/evaluation-service/logs

## 🧪 Screenshots

## ✅ Postman requests/responses for backend

![Alt Text](https://github.com/yesiamkriti/12217521/blob/main/frontend/public/test-backend.png)
## ✅ Frontend screenshots

![Alt Text](https://github.com/yesiamkriti/12217521/blob/main/frontend/public/url-mainpage.png)

## ✅ Click stats page and log entries
![Alt Text](https://github.com/yesiamkriti/12217521/blob/main/frontend/public/stats.png)

📜 License
This project is submitted solely for evaluation under the Affordmed Full Stack Internship Challenge. Not intended for production use.
