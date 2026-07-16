# ⌨️ Dev-Typing

A competitive, developer-focused typing practice app. Instead of typing generic prose, you type **real code snippets** — in the language of your choice, at the difficulty you pick — and get instant feedback on your **WPM**, **accuracy**, and **time**.

**Live demo:** [dev-typing.vercel.app](https://dev-typing.vercel.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)
- [Scripts](#-scripts)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🚀 Features

- **Multi-language snippets** — JavaScript, Python, Java, C++, HTML, and CSS
- **Difficulty tiers** — Easy, Medium, and Hard for every language
- **Live typing feedback** — real-time progress %, elapsed timer, and per-character correctness highlighting
- **WPM & accuracy scoring** — calculated on completion from characters typed, errors, and time elapsed
- **Google Sign-In** — one-click OAuth login via `@react-oauth/google`
- **Username registration** — first-time users pick a unique username after signing in
- **Profile & history** — view your past test results in a table, with the ability to delete individual entries
- **Retro, responsive UI** — built with Tailwind CSS
- **CI pipeline** — GitHub Actions lints and builds the client on every push/PR

> **Note:** The features above reflect what's currently implemented. Real-time multiplayer racing and an Elo-based ranking system are planned but not yet built — see [Roadmap](#-roadmap).

---

## 🛠️ Tech Stack

**Frontend** (`client/`)
- React 19 + Vite 8
- React Router DOM 7
- Axios
- Tailwind CSS 4
- React Icons
- `@react-oauth/google`

**Backend** (`server/`)
- Node.js (ESM)
- Express 5
- Mongoose 9 + MongoDB
- `cors`, `dotenv`

---

## 📁 Project Structure

```
Dev-typing/
├── .github/workflows/
│   └── client-ci.yml        # CI: lint + build the client
├── client/                  # React front-end (Vite)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── GoogleOath.jsx   # Google OAuth + username modal
│   │   │   ├── TypingArea.jsx   # Snippets, typing logic, WPM/accuracy calc
│   │   │   └── header.jsx
│   │   ├── pages/
│   │   │   ├── home.jsx
│   │   │   ├── practice.jsx     # Language + difficulty selection
│   │   │   ├── typing.jsx       # Hosts TypingArea
│   │   │   ├── result.jsx       # Shows metrics, saves result
│   │   │   ├── register.jsx
│   │   │   └── profile.jsx      # History table + delete
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                  # Express back-end
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/
│   ├── models/
│   │   ├── User.js
│   │   └── Result.js
│   ├── routes/
│   ├── index.js             # Express app entry point
│   └── package.json
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher
- A running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Google OAuth Client ID](https://console.cloud.google.com/apis/credentials)

### 1. Clone the repository

```bash
git clone https://github.com/RockY010101/Dev-typing.git
cd Dev-typing
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
MONGO_URI=<your MongoDB connection string>
PORT=5000
```

Start the server:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:3000` (or the port Vite assigns).

### 4. Build for production

```bash
cd client
npm run build
```

---

## 🔑 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `MONGO_URI` | `server/.env` | MongoDB connection string. Defaults to `mongodb://localhost:27017/dev-typing` if not set. |
| `PORT` | `server/.env` | Port the Express server listens on. Defaults to `5000`. |
| `VITE_API_URL` | `client/.env` | Base URL the client uses for API calls (Axios `baseURL`). |

---

## 🔌 API Reference

### Users — `/api/users`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users/auth` | Finds or creates a user by email (called after Google login). |
| `POST` | `/api/users/username` | Sets a unique username for a user. |
| `GET` | `/api/users/:id` | Retrieves a user's profile. |

### Results — `/api/results`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/results` | Creates a new typing test result for a user. |
| `GET` | `/api/results/user/:id` | Retrieves all results for a user, most recent first. |
| `DELETE` | `/api/results/:id` | Deletes a result by ID. |

---

## 🗃️ Data Models

**User**

| Field | Type | Notes |
|---|---|---|
| `email` | String | Required, unique |
| `username` | String | Unique, set after first login |
| `googleId` | String | Required, unique |
| `picture` | String | Optional |
| `name` | String | Optional |

**Result**

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId | References `User` |
| `wpm` | Number | Required |
| `accuracy` | Number | Required (%) |
| `timeTaken` | Number | Required (seconds) |
| `language` | String | Default: `"JavaScript"` |
| `difficulty` | String | Default: `"easy"` |

---

## 📜 Scripts

**Client**

```bash
npm run dev       # start dev server
npm run build     # production build
npm run lint      # run oxlint
npm run preview   # preview production build
```

**Server**

```bash
npm run dev       # start server
npm start         # start server (same as dev)
```

---

## 🗺️ Roadmap

- [ ] Real-time multiplayer typing races
- [ ] Elo-based ranking system and public leaderboard
- [ ] Automated backend test suite
- [ ] Move Google OAuth Client ID to an environment variable
- [ ] Pagination for result history

---

## 📝 License

This project is licensed under the **MIT License**.
