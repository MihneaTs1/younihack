# CyberHack 2025 Registration App

This project is a full-stack registration system for the CyberHack 2025 event. It features a React frontend and a Node.js/Express backend that stores registrations in CSV files and handles email confirmation.

## Features

- Modern React frontend for event info and registration
- Node.js/Express backend with CSV storage
- Email confirmation for registrations (with Gmail SMTP)
- Environment variable support for easy deployment
- Duplicate email prevention and confirmation tracking

## Setup

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

Create a `.env` file in the project root with:

```env
MAIL_USER=your.email@gmail.com
MAIL_PASS=your-app-password
BACKEND_ADDRESS=http://localhost:5000
FRONTEND_ADDRESS=http://localhost:3000
```

For the React frontend, create a `.env.local` file in the project root with:

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

## How it works

- Users register via the form. Data is sent to the backend and saved in `registrations.csv`.
- A confirmation email is sent. The user must click the link to confirm.
- Confirmed registrations are added to `registrations-confirmed.csv`.
- Duplicate emails are blocked (checked in both CSVs).

## Troubleshooting

- If emails are not sent, ensure you use a Gmail app password and allow less secure apps if needed.
- Restart both backend and frontend after changing environment files.
- For production, set the addresses in `.env` and `.env.local` to your deployed URLs.

## Scripts

- `npm start` — Start the React frontend
- `node server.js` — Start the backend server
- `npm run build` — Build the React app for production

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
