// Simple Express server for registration form
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const nodemailer = require('nodemailer');
const os = require('os');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));

const csvPath = path.join(__dirname, 'registrations.csv');

// --- Ensure CSVs Exist with Headers ---
function ensureCsvWithHeaders(filePath, headers) {
  const expectedHeaderLine = headers.map(h => h.title).join(',');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, expectedHeaderLine + '\n');
  } else {
    const firstLine = fs.readFileSync(filePath, 'utf8').split('\n')[0];
    if (firstLine.trim() !== expectedHeaderLine.trim()) {
      const data = fs.readFileSync(filePath, 'utf8');
      fs.writeFileSync(filePath, expectedHeaderLine + '\n' + data.split('\n').slice(1).join('\n'));
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
  service: 'gmail',
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
    const confirmedLines = fs.readFileSync(confirmedCsvPath, 'utf8').split('\n');
    alreadyConfirmed = confirmedLines.some(line => line.startsWith(id + ','));
  }
  if (!alreadyConfirmed) {
    confirmedCsvWriter.writeRecords([
      Object.fromEntries(header.split(',').map((h, i) => [csvHeaders[i].id, entry.split(',')[i]]))
    ]);
  }
  res.send(renderConfirmPage(alreadyConfirmed ? 'You have already confirmed your registration.' : 'Registration confirmed! See you at the event.', true));
});

function renderConfirmPage(message, success) {
  // All styles are now embedded for a consistent, modern look
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>YouniHack Registration Confirmation</title>
    <link rel="icon" href="/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    <style>
      body {
        margin: 0;
        font-family: 'Montserrat', 'Segoe UI', 'Roboto', 'Arial', sans-serif;
        background: #101114;
        color: #fff;
      }
      .App-header {
        background: linear-gradient(135deg, #181922 60%, #006600 100%);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: white;
        padding-top: 7rem;
      }
      .confirmation-section {
        background: rgba(16, 17, 20, 0.92);
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.12);
        padding: 2rem 2.5rem;
        margin: 2rem auto;
        max-width: 600px;
        text-align: center;
      }
      h1 {
        font-family: 'Orbitron', 'Montserrat', sans-serif;
        font-size: 3rem;
        margin-bottom: 1rem;
        letter-spacing: 1px;
        text-shadow: 0 4px 24px #00990033;
      }
      .confirmation-section h2 {
        color: #009900;
        margin-bottom: 1rem;
        font-family: 'Orbitron', 'Montserrat', sans-serif;
      }
      .confirmation-btn {
        background: linear-gradient(90deg, #009900 60%, #00b894 100%);
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 0.8rem 2.2rem;
        font-size: 1.15rem;
        font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
        font-weight: 700;
        margin-top: 2rem;
        cursor: pointer;
        box-shadow: 0 2px 8px #00990033;
        transition: background 0.2s, box-shadow 0.2s, color 0.2s;
        outline: none;
        display: inline-block;
      }
      .confirmation-btn:hover {
        background: linear-gradient(90deg, #00b894 60%, #009900 100%);
        color: #fff;
        box-shadow: 0 4px 16px #00b89444;
      }
      @media (max-width: 700px) {
        .confirmation-section {
          padding: 1.2rem 0.7rem;
          margin: 1rem 0.2rem;
        }
        .App-header {
          padding-top: 4rem;
        }
        h1 {
          font-size: 2rem;
        }
      }
    </style>
  </head>
  <body>
    <header class="App-header">
      <h1>YouniHack 2025</h1>
      <section class="confirmation-section">
        <h2>${success ? 'Success!' : 'Error'}</h2>
        <p style="font-size:1.2rem;">${message}</p>
        <a href="${process.env.FRONTEND_ADDRESS || '/'}"><button class="confirmation-btn">Back to site</button></a>
      </section>
    </header>
  </body>
</html>`;
}

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.post('/register', async (req, res) => {
  const { name, surname, email, prefix, phone, country, city } = req.body;
  if (!name || !surname || !email || !prefix || !phone || !country || !city) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const emails = [
    ...readCsvEmails(csvPath),
    ...readCsvEmails(confirmedCsvPath)
  ];
  if (emails.includes(email)) {
    return res.status(409).json({ error: 'This email is already registered.' });
  }
  const id = Date.now() + '-' + Math.floor(Math.random() * 100000);
  await csvWriter.writeRecords([
    { id, name, surname, email, prefix, phone, country, city }
  ]);
  // Send confirmation email
  const confirmUrl = `${process.env.BACKEND_ADDRESS || `http://${getLocalIp()}:${PORT}`}/confirm?id=${id}`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'YouniHack Registration Confirmation',
    html: `<p>Hi ${name},</p><p>Thank you for registering for YouniHack 2025! Please confirm your registration by clicking the link below:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p><p>If you did not register, you can ignore this email.</p>`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not send confirmation email.' });
  }
});

// Catch-all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
