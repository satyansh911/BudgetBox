# 📦 BudgetBox - Offline-First Personal Budgeting App

> **Assignment Name**: BudgetBox  
> **Built by**: Satyansh Singh
> **Role**: Frontend/Fullstack Developer

## 🎯 Overview

BudgetBox is a real, working **offline-first personal budgeting application** that follows local-first principles. It works completely offline, auto-saves every keystroke locally, and syncs safely when the network returns—just like Google Docs offline mode.

## ✨ Features

### 1. Budget Management
- ✅ Add/Edit monthly budget with 6 categories
- ✅ Auto-save every keystroke instantly
- ✅ Works completely offline
- ✅ Never loses data

### 2. Auto-Generated Dashboard
- 📊 **Burn Rate**: Total expenses / Income
- 💰 **Savings Potential**: Income - Total Spend
- 📈 **Month-End Prediction**: Based on current trend
- 🥧 **Category Pie Chart**: Visual breakdown using Chart.js
- ⚠️ **Anomaly Warnings**: Rule-based suggestions

### 3. Local-First Data Behavior
- 💾 **Local DB**: IndexedDB via LocalForage
- 🔄 **Offline Support**: Works with 0 internet
- 📡 **Sync Logic**: Clear status indicators (Local Only / Sync Pending / Synced)
- 🔔 **Offline Indicator**: Shows connection status

### 4. AI Suggestions (Rule-Based)
- Food > 40% of income → Reduce food spend
- Subscriptions > 30% → Cancel unused apps
- Savings negative → Expenses exceed income
- Bills > 50% → Reduce fixed costs

## 🏗️ Architecture
