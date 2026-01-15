const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ STATIC FILES (CSS / JS / IMAGES)
app.use(express.static(path.join(__dirname, 'public')));

// ===== PAGES =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/records', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'record.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ===== API =====
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/add-patient', (req, res) => {
  res.redirect('/records');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/register', (req, res) => {
  console.log(req.body); // check data aa raha ya nahi

  // abhi sirf success response bhej rahe
  res.json({
    success: true,
    message: 'Patient registered successfully'
  });
});