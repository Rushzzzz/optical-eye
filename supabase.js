const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 8080;

const supabase = require("./supabase");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TEST
app.get("/", (req, res) => {
  res.send("Server running successfully ✅");
});

// 🔥 PATIENTS API
app.get("/api/patients", async (req, res) => {
  const { data, error } = await supabase
    .from("patients")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/ping', (req, res) => {
  res.send('pong');
});