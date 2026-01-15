const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== PAGES =====

// home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// register page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// records page
app.get('/records', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'record.html'));
});

// login page (agar hai)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ===== API =====

// ping (uptimerobot)
app.get('/ping', (req, res) => {
  res.send('pong');
});

// example form submit (SUPABASE yahin lagega)
app.post('/add-patient', async (req, res) => {
  console.log(req.body);
  res.redirect('/records');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});