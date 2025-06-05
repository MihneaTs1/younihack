# YouniHack 2025 Registration App

[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-blue)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern full-stack registration system for the YouniHack 2025 event. Features a React frontend and a Node.js/Express backend with CSV storage and email confirmation.

---

## 🚀 Features

- ✨ Modern React frontend for event info and registration
- 🗃️ Node.js/Express backend with CSV storage (no database needed)
- 📧 Email confirmation for registrations (Gmail SMTP)
- 🔒 Duplicate email prevention and confirmation tracking
- 🌱 Easy deployment with environment variables
- 📊 Live registration stats

---

## 🛠️ Prerequisites

- Node.js (v16+ recommended)
- npm (v8+ recommended)
- Gmail account for sending confirmation emails (App Password required)

---

## ⚡ Quick Start

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd hackaton
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MAIL_USER=your.email@gmail.com
MAIL_PASS=your-app-password
BACKEND_ADDRESS=http://localhost:5000
FRONTEND_ADDRESS=http://localhost:3000
```

For the React frontend, create a `.env.local` file in the project root:

```env
REACT_APP_BACKEND_ADDRESS=http://localhost:5000
```

### 4. Start the backend

```sh
node server.js
```

### 5. Start the frontend

```sh
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📝 How it works

1. Users register via the form. Data is sent to the backend and saved in `registrations.csv`.
2. A confirmation email is sent. The user must click the link to confirm.
3. Confirmed registrations are added to `registrations-confirmed.csv`.
4. Duplicate emails are blocked (checked in both CSVs).

---

## 🔌 API Endpoints

- `POST /register` — Register a new user
- `GET /stats` — Get registration statistics
- `GET /confirm/:token` — Confirm registration via email link

---

## 🐞 Troubleshooting

- **Emails not sent?** Ensure you use a Gmail app password and allow less secure apps if needed.
- **Environment changes?** Restart both backend and frontend after editing `.env` files.
- **Production:** Set addresses in `.env` and `.env.local` to your deployed URLs.

---

## 📜 Scripts

- `npm start` — Start the React frontend
- `node server.js` — Start the backend server
- `npm run build` — Build the React app for production

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
