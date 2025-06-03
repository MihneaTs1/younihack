// Simple Express server for registration form
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const csvPath = path.join(__dirname, 'registrations.csv');
const csvWriter = createObjectCsvWriter({
  path: csvPath,
  header: [
    {id: 'id', title: 'ID'},
    {id: 'name', title: 'First Name'},
    {id: 'surname', title: 'Last Name'},
    {id: 'email', title: 'Email'},
    {id: 'prefix', title: 'Prefix'},
    {id: 'phone', title: 'Phone'},
    {id: 'country', title: 'Country'},
    {id: 'city', title: 'City'}
  ],
  append: fs.existsSync(csvPath)
});

// Configure your email transport (use your real credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another SMTP provider
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const confirmedCsvPath = path.join(__dirname, 'registrations-confirmed.csv');
const confirmedCsvWriter = createObjectCsvWriter({
  path: confirmedCsvPath,
  header: [
    {id: 'id', title: 'ID'},
    {id: 'name', title: 'First Name'},
    {id: 'surname', title: 'Last Name'},
    {id: 'email', title: 'Email'},
    {id: 'prefix', title: 'Prefix'},
    {id: 'phone', title: 'Phone'},
    {id: 'country', title: 'Country'},
    {id: 'city', title: 'City'}
  ],
  append: fs.existsSync(confirmedCsvPath)
});

function readCsvEmails(csvPath) {
  if (!fs.existsSync(csvPath)) return [];
  const data = fs.readFileSync(csvPath, 'utf8');
  return data.split('\n').slice(1).map(line => line.split(',')[3]).filter(Boolean);
}

const FRONTEND_ADDRESS = process.env.FRONTEND_ADDRESS || 'http://localhost:3000';
const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS || 'http://localhost:5000';

app.get('/confirm', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).send(renderConfirmPage('Invalid confirmation link.', false));
  if (!fs.existsSync(csvPath)) return res.status(404).send(renderConfirmPage('Registration not found.', false));
  const lines = fs.readFileSync(csvPath, 'utf8').split('\n');
  const header = lines[0];
  const entry = lines.find(line => line.startsWith(id + ','));
  if (!entry) return res.status(404).send(renderConfirmPage('Registration not found.', false));
  // Check if already confirmed
  let alreadyConfirmed = false;
  if (fs.existsSync(confirmedCsvPath)) {
    const confirmed = fs.readFileSync(confirmedCsvPath, 'utf8').split('\n').find(line => line.startsWith(id + ','));
    if (confirmed) alreadyConfirmed = true;
  }
  if (!alreadyConfirmed) {
    // Only append if not already confirmed
    // Only write the header if the file is empty
    const isEmpty = !fs.existsSync(confirmedCsvPath) || fs.readFileSync(confirmedCsvPath, 'utf8').trim() === '';
    // Only append the entry (not header) if the file is not empty and already has the header
    if (isEmpty) {
      fs.appendFileSync(confirmedCsvPath, header + '\n' + entry + '\n');
    } else {
      // Check if the entry is already present (shouldn't be, but double check)
      const confirmedLines = fs.readFileSync(confirmedCsvPath, 'utf8').split('\n');
      if (!confirmedLines.some(line => line.startsWith(id + ','))) {
        fs.appendFileSync(confirmedCsvPath, entry + '\n');
      }
    }
  }
  res.send(renderConfirmPage(alreadyConfirmed ? 'Registration already confirmed.' : 'Registration confirmed! Thank you.', true));
});

function renderConfirmPage(message, success) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CyberHack 2025 Registration Confirmation</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    <style>
      body {
        margin: 0;
        font-family: 'Montserrat', 'Segoe UI', 'Roboto', 'Arial', sans-serif;
        background: #101114;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .TopBar-logo {
        font-family: 'Orbitron', 'Montserrat', sans-serif;
        font-size: 2rem;
        font-weight: 800;
        margin: 2rem 0 1.5rem 0;
        letter-spacing: 2px;
        color: #009900;
        text-shadow: 0 2px 12px #00990044;
        text-align: center;
        text-decoration: none;
      }
      .confirm-container {
        background: rgba(16, 17, 20, 0.97);
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.12);
        padding: 2.5rem 2.5rem 2rem 2.5rem;
        max-width: 500px;
        margin: 0 auto;
        text-align: center;
      }
      .confirm-title {
        color: #009900;
        font-family: 'Orbitron', 'Montserrat', sans-serif;
        font-size: 2rem;
        margin-bottom: 1.2rem;
      }
      .confirm-message {
        color: ${success ? '#00b894' : '#e17055'};
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
      }
      .App-link {
        background: linear-gradient(90deg, #009900 60%, #23243a 100%);
        color: #fff;
        padding: 1rem 2.5rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        font-size: 1.2rem;
        margin-top: 2rem;
        display: inline-block;
        box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s;
        font-family: 'Montserrat', 'Segoe UI', 'Roboto', 'Arial', sans-serif;
        border: none;
        outline: none;
        cursor: pointer;
      }
      .App-link:hover {
        background: linear-gradient(90deg, #007700 60%, #23243a 100%);
        color: #e0ffe6;
        box-shadow: 0 4px 16px #00990044;
        transform: translateY(-2px) scale(1.03);
      }
    </style>
  </head>
  <body>
    <a href="${FRONTEND_ADDRESS}/" class="TopBar-logo">CyberHack 2025</a>
    <div class="confirm-container">
      <div class="confirm-title">Registration Confirmation</div>
      <div class="confirm-message">${message}</div>
      <a href="${FRONTEND_ADDRESS}/" class="App-link">Back to Home</a>
    </div>
  </body>
  </html>`;
}

app.post('/register', async (req, res) => {
  const { name, surname, email, prefix, phone, country, city } = req.body;
  if (!name || !surname || !email || !prefix || !phone || !country || !city) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  // Check if email already exists in registrations.csv or registrations-confirmed.csv
  const emails = [
    ...readCsvEmails(csvPath),
    ...readCsvEmails(confirmedCsvPath)
  ];
  if (emails.includes(email)) {
    return res.status(409).json({ error: 'Email already registered.' });
  }
  try {
    // Generate a unique ID (timestamp + random)
    const id = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    await csvWriter.writeRecords([
      { id, name, surname, email, prefix, phone, country, city }
    ]);
    // Send confirmation email
    const confirmUrl = `${BACKEND_ADDRESS}/confirm?id=${id}`;
    try {
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Confirm your registration for CyberHack 2025',
        text: `Hi ${name},\n\nThank you for registering for CyberHack 2025! Please confirm your registration by clicking the link below:\n${confirmUrl}\n\nIf you did not register, please ignore this email.\n\nBest,\nCyberHack Team`
      });
    } catch (mailErr) {
      return res.status(200).json({ success: true, warning: 'Registration saved, but confirmation email failed.' });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
