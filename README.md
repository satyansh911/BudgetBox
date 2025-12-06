# 📦 BudgetBox - Offline-First Personal Budgeting App

> **Assignment**: BudgetBox  
> **Built by**: Satyansh Singh  
> **Role**: Frontend/Fullstack Developer  
> **Status**: ✅ Production Ready

A real, working **offline-first personal budgeting application** that follows local-first principles. Works completely offline, auto-saves every keystroke locally, and syncs safely when the network returns—just like Google Docs.

## 🚀 Live Demo

- **Frontend**: [BudgetBox App](https://budgetbox-beta.vercel.app/)
- **Backend**: [BudgetBox Backend](https://budgetbox-production-456a.up.railway.app/)
- **GitHub Repo**: [satyansh911/BudgetBox](https://github.com/satyansh911/BudgetBox)

## ✨ Key Features

### 💰 Budget Management
- Add/Edit monthly budget with 6 categories (Income, Bills, Food, Transport, Subscriptions, Miscellaneous)
- Auto-save on every keystroke instantly
- Works completely offline with zero internet
- Never loses data—all changes persisted locally

### 📊 Smart Dashboard Analytics
- **Burn Rate**: Total expenses as % of income
- **Savings Potential**: Income minus total spend
- **Month-End Prediction**: Based on current spending trend
- **Category Pie Chart**: Visual expense breakdown with Chart.js
- **Detailed Breakdown**: Progress bars for each expense category
- **Lottie Animations**: Beautiful animated suggestions

### ⚠️ AI-Powered Suggestions (Rule-Based)
- 🍽️ Food expenses > 40% → "Consider meal planning"
- 📺 Subscriptions > 30% → "Cancel unused apps"
- 🏠 Bills > 50% → "Explore ways to reduce fixed costs"
- 🚨 Expenses > Income → "You need to cut spending!"
- 💡 Savings > 50% of income → "Great job! Keep it up!"

### 🔄 Local-First Data Architecture
- **LocalStorage Persistence**: All data stored in IndexedDB via LocalForage
- **Offline Mode**: Full app functionality with zero internet
- **Smart Sync**: Auto-sync when online with clear status indicators
  - 🔵 **Local Only** - Saved locally, never synced
  - ⏳ **Sync Pending** - Edits waiting for network
  - ✅ **Synced** - Server & local aligned
- **Online/Offline Indicator**: Real-time connection status badge

### 🎨 Beautiful UI/UX
- Clean, modern design with TailwindCSS
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Intuitive form inputs with empty state handling
- Dark mode compatible

## 🏗️ Architecture (Text Diagram)

        Frontend (React + Tailwind)             Backend Layer
                                                     |
    +---------------------+                          |
    |                     |          (1)             |
    |   Budget Input UI   | <-------------------------  API Sync (POST /sync)
    |  (Auto Save Form)   | ---+
    +---------------------+    |
                               | (2)
    +---------------------+    |
    |                     | <--+                  (2)
    |   LocalForage DB    | <-------------------------  API Fetch (GET /data)
    |  (IndexedDB Store)  | ------------+
    +---------------------+             |
             | (3)                      | (5)
             v                          v
    +---------------------+       +---------------------+
    |                     |       |                     |
    |   Sync Engine       |       |   Rule Engine       |
    | (Online/Offline)    |----+  |  (AI Suggestions)   |
    +---------------------+    |  +---------------------+
                               |
    +---------------------+    | (4)
    |                     | <--+
    |   Network Layer     |
    |  (Navigator API)    |
    +---------------------+

## 🛠️ Setup Steps

### Prerequisites
- Node.js 18+
- npm
- Railway project with Postgres (or any reachable Postgres)

### Backend
```bash
cd backend
# set .env
# PORT=3001
# DATABASE_URL=postgresql://<user>:<pass>@<host>:5432/<db>?sslmode=require
# JWT_SECRET=<strong-secret>
npm install
npm start
```
### Frontend
```bash
cd frontend
# .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001
npm install
npm run dev
```

## Deploy (brief)
- Backend:
  - Deploy backend folder to Railway.
  - Build: npm install
  - Start: node server.js
  - set env vars above.
- Frontend:
  - Deploy frontend to Vercel.
  - Set NEXT_PUBLIC_API_URL to your Railway backend URL.
  - Redeploy.

## 🧪 How to Test Offline Mode
- Open the app and log in with the demo user (see below).
- Open DevTools → Network → check “Offline”.
- Change budget fields; they auto-save to IndexedDB and show “Sync Pending”.
- Uncheck “Offline”; the app auto-syncs and shows “Synced”.
- Refresh: data persists (local-first) and stays in sync.

## 📸 Screenshots
- Login Page:
  <img width="1913" height="912" alt="image" src="https://github.com/user-attachments/assets/bebcc36e-1764-40d3-b5d0-3eb3b678490c" />

- Dashboard:
  <img width="1887" height="910" alt="image" src="https://github.com/user-attachments/assets/0b522b7e-6d60-4dd5-8480-cb899a462354" />
  <img width="1898" height="911" alt="image" src="https://github.com/user-attachments/assets/ab23c999-7e12-4aa6-aca2-0e251aba8d21" />

- Video Presentation:

https://github.com/user-attachments/assets/fd52b2dd-7b92-49b6-9d84-14ddc2381485

## 👤 Demo Credentials
- Email: hire-me@anshumat.org
- Password: HireMe@2025!

## 📡 API Endpoints
- POST /api/auth/login
- POST /api/budget/sync
- GET  /api/budget/latest?month=YYYY-MM

## 🧰 Tech Stack
- Frontend: Next.js 15, React 18, TS, TailwindCSS, Zustand, Chart.js, Lottie
- Backend: Node.js, Express, PostgreSQL (pg), JWT, bcrypt
- Local storage: LocalForage (IndexedDB)

## 🔒 Security
- JWT auth
- bcrypt passwords
- SSL to Postgres
- env-based secrets

## 🧭 Troubleshooting
- 404 on API: ensure backend service root is backend, start command node server.js, correct NEXT_PUBLIC_API_URL.
- DB errors: check DATABASE_URL with ?sslmode=require, and Railway Postgres is running.
- CORS: frontend domain must be allowed; update CORS origins in server.js if you change domains.
