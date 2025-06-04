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

// --- Ensure CSVs Exist with Headers ---
function ensureCsvWithHeaders(filePath, headers) {
  const expectedHeaderLine = headers.map(h => h.title).join(',');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, expectedHeaderLine + '\n');
  } else {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split(/\r?\n/);
    if (lines[0] !== expectedHeaderLine) {
      // Replace header, keep data rows (skip old header)
      const newContent = [expectedHeaderLine, ...lines.slice(1)].join('\n');
      fs.writeFileSync(filePath, newContent);
    }
  }
}

const csvHeaders = [
  {id: 'id', title: 'ID'},
  {id: 'name', title: 'First Name'},
  {id: 'surname', title: 'Last Name'},
  {id: 'email', title: 'Email'},
  {id: 'prefix', title: 'Prefix'},
  {id: 'phone', title: 'Phone'},
  {id: 'country', title: 'Country'},
  {id: 'city', title: 'City'}
];

ensureCsvWithHeaders(csvPath, csvHeaders);
const confirmedCsvPath = path.join(__dirname, 'registrations-confirmed.csv');
ensureCsvWithHeaders(confirmedCsvPath, csvHeaders);

const csvWriter = createObjectCsvWriter({
  path: csvPath,
  header: csvHeaders,
  append: true
});
const confirmedCsvWriter = createObjectCsvWriter({
  path: confirmedCsvPath,
  header: csvHeaders,
  append: true
});

// Configure your email transport (use your real credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another SMTP provider
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

function readCsvEmails(csvPath) {
  if (!fs.existsSync(csvPath)) return [];
  const data = fs.readFileSync(csvPath, 'utf8');
  return data.split('\n').slice(1).map(line => line.split(',')[3]).filter(Boolean);
}

app.get('/stats', (req, res) => {
  const regCount = fs.existsSync(csvPath) ? fs.readFileSync(csvPath, 'utf8').split('\n').filter(Boolean).length - 1 : 0;
  const confCount = fs.existsSync(confirmedCsvPath) ? fs.readFileSync(confirmedCsvPath, 'utf8').split('\n').filter(Boolean).length - 1 : 0;
  res.json({ registered: regCount, confirmed: confCount });
});

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
    const isEmpty = !fs.existsSync(confirmedCsvPath) || fs.readFileSync(confirmedCsvPath, 'utf8').trim() === '';
    if (isEmpty) {
      fs.appendFileSync(confirmedCsvPath, header + '\n' + entry + '\n');
    } else {
      const confirmedLines = fs.readFileSync(confirmedCsvPath, 'utf8').split('\n');
      if (!confirmedLines.some(line => line.startsWith(id + ','))) {
        fs.appendFileSync(confirmedCsvPath, entry + '\n');
      }
    }
  }
  res.send(renderConfirmPage(alreadyConfirmed ? 'Registration already confirmed.' : 'Registration confirmed! Thank you.', true));
});

function renderConfirmPage(message, success) {
  const frontendUrl = process.env.FRONTEND_ADDRESS || 'http://localhost:3000';
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YouniHack 2025 Registration Confirmation</title>
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
    <a href="${frontendUrl}/" class="TopBar-logo">YouniHack 2025</a>
    <div class="confirm-container">
      <div class="confirm-title">Registration Confirmation</div>
      <div class="confirm-message">${message}</div>
      <a href="${frontendUrl}/" class="App-link">Back to Home</a>
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
    const confirmUrl = `${process.env.BACKEND_ADDRESS || 'http://localhost:5000'}/confirm?id=${id}`;
    const regMailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Confirm your registration for YouniHack 2025',
      text: `Hi ${name},\n\nThank you for registering for YouniHack 2025! Please confirm your registration by clicking the link below:\n${confirmUrl}\n\nIf you did not register, please ignore this email.\n\nBest,\nCyberHack Team`,
      html: `<p>Hi ${name},</p><p>Thank you for registering for YouniHack 2025! Please confirm your registration by clicking the link below:</p><p><a href=\"${confirmUrl}\">${confirmUrl}</a></p><p>If you did not register, please ignore this email.</p><p>Best,<br/>CyberHack Team</p>`
    };
    await transporter.sendMail(regMailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
