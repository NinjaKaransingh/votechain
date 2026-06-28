<div align="center">

![VoteChain Banner](https://capsule-render.vercel.app/api?type=waving&color=1D9E75&height=200&section=header&text=VoteChain&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Your%20Voice.%20Your%20Vote.%20Your%20Power.&descAlignY=60&descAlign=50)

### `YOUR VOICE. YOUR VOTE. YOUR POWER.`

<br/>

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)

[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev)

<br/>

> **A full-stack secure voting platform built on the MERN stack.**
> Register as a candidate. Cast your vote. Watch results live.

<br/>

</div>

---

## ⚡ What is VoteChain?

**VoteChain** is a modern, secure, and transparent digital voting system. Built from scratch using the **MERN stack**, it handles everything from candidate registration to real-time vote results — with JWT-based authentication and duplicate-vote prevention baked in at the database level.

This is not a tutorial clone. Every line is written with purpose.

---

## 🗂️ Project Structure

```
VoteChain/
│
├── 📁 frontend/                  # React + Vite
│   └── src/
│       ├── components/           # Reusable UI components
│       ├── pages/
│       │   ├── HomePage.jsx      # Landing page with live ticker
│       │   ├── RegisterPage.jsx  # 3-step candidate registration
│       │   └── VotePage.jsx      # Vote screen with live results
│       └── styles/               # CSS per page
│
└── 📁 backend/                   # Node.js + Express
    ├── config/
    │   └── db.js                 # MongoDB connection
    ├── models/
    │   ├── User.js               # Voters & candidates
    │   ├── Candidate.js          # Candidate profiles
    │   ├── Poll.js               # Election polls
    │   └── Vote.js               # Vote records
    ├── routes/                   # API endpoints
    ├── controllers/              # Business logic
    ├── middleware/               # JWT auth guard
    └── server.js                 # Entry point
```

---

## 🚀 Features

| Feature | Status |
|---|---|
| 🏠 Landing page with live activity ticker | ✅ Done |
| 📋 3-step candidate registration flow | ✅ Done |
| 🗳️ Vote screen with candidate cards | ✅ Done |
| 📊 Live results with animated bars | ✅ Done |
| 🔐 JWT Authentication | 🔄 In Progress |
| 🛡️ Duplicate vote prevention (DB level) | 🔄 In Progress |
| 📡 REST API (Express + MongoDB) | 🔄 In Progress |
| 🔗 Frontend ↔ Backend integration | ⏳ Planned |

---

## 🧠 Data Architecture

```
┌──────────┐     ┌───────────┐     ┌──────────┐
│   User   │────▶│ Candidate │────▶│   Poll   │
│          │     │           │     │          │
│ name     │     │ userId    │     │ title    │
│ email    │     │ party     │     │ region   │
│ password │     │ bio       │     │ candidates│
│ role     │     │ photo     │     │ isActive │
│ state    │     │ voteCount │     │ endDate  │
└──────────┘     └───────────┘     └──────────┘
                                        │
                                        ▼
                                   ┌──────────┐
                                   │   Vote   │
                                   │          │
                                   │ voterId  │
                                   │ candidateId│
                                   │ pollId   │
                                   └──────────┘
```

One voter. One poll. One vote. Enforced at the **database level** with a compound unique index.

---

## 🔌 API Endpoints

```
AUTH
  POST   /api/auth/register          → Register new user
  POST   /api/auth/login             → Login & receive JWT

CANDIDATES
  POST   /api/candidates/register    → Register as candidate
  GET    /api/candidates             → Get all candidates

POLLS
  POST   /api/polls/create           → Create a new poll
  GET    /api/polls                  → Get all active polls
  GET    /api/polls/:id              → Get single poll

VOTES
  POST   /api/votes/cast             → Cast a vote
  GET    /api/votes/results/:pollId  → Get live results
```

---

## 🛠️ Tech Stack

```
Frontend          Backend           Database          Auth
─────────         ───────           ────────          ────
React 18          Node.js           MongoDB           JWT
Vite              Express.js        Mongoose          bcryptjs
React Router v6   REST API          Compound Index    dotenv
CSS3              CORS              4 Collections
```

---

## 🏃 Getting Started

**1. Clone the repo**
```bash
git clone https://github.com/yourusername/votechain.git
cd votechain
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/votingapp
JWT_SECRET=your_secret_key_here
```

```bash
npm run dev
```

**3. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

**4. Open in browser**
```
Frontend  →  http://localhost:5173
Backend   →  http://localhost:5000
```

---

## 📍 Roadmap

```
 ✅ Phase 1 — UI (Home, Register, Vote screens)
 🔄 Phase 2 — Backend (Models, Routes, Controllers)
 ⏳ Phase 3 — Auth (JWT, Protected Routes)
 ⏳ Phase 4 — Integration (Frontend ↔ Backend)
 ⏳ Phase 5 — Polish (Loading states, Error handling)
```

---

## 👨‍💻 Author

Built with purpose, not just practice.

> *"Every feature in this project exists for a reason. Every line of code was written to learn something real."*

---

<div align="center">

**⭐ Star this repo if you found it useful**

`MongoDB` · `Express` · `React` · `Node.js` · `JWT` · `Mongoose`

</div>
