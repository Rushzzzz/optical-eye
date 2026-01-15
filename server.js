const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 STATIC FILES (CSS, JS, HTML)
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 PAGES ROUTES
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/records', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'records.html'));
});

// 🔹 API TEST
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

// 🔹 FORM SUBMIT API (TEMP TEST)
app.post('/api/register', (req, res) => {
  console.log(req.body);
  res.status(200).json({ success: true });
});

app.post('/api/patients', async (req, res) => {
  try {
    console.log(req.body); // debug

    // Dummy success response (abhi DB nahi bhi ho to chalega)
    res.status(200).json({
      success: true,
      patientId: Date.now()
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});