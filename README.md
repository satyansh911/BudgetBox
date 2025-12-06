# 📦 BudgetBox - Offline-First Personal Budgeting App

> **Assignment**: BudgetBox  
> **Built by**: Satyansh Singh  
> **Role**: Frontend/Fullstack Developer  
> **Status**: ✅ Production Ready

A real, working **offline-first personal budgeting application** that follows local-first principles. Works completely offline, auto-saves every keystroke locally, and syncs safely when the network returns—just like Google Docs.

## 🚀 Live Demo

- **Frontend**: [BudgetBox App](https://budgetbox.vercel.app)
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