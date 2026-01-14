const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get('/', (req, res) => {
  res.send('Server is running successfully ✅');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const cron = require('node-cron');
const https = require('https');

// apni deployed website ka URL yaha daalo
const URL = 'https://optical-eye.onrender.com/ping';

cron.schedule('*/5 * * * *', () => {
  https.get(URL, (res) => {
    console.log('Self ping success:', res.statusCode);
  }).on('error', (err) => {
    console.log('Ping failed:', err.message);
  });
});