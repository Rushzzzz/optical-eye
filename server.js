const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { body, validationResult } = require('express-validator');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000; // Changed from 5500 to 3000

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Delete the existing database file if it exists
try {
    if (fs.existsSync('./optical_clinic.db')) {
        fs.unlinkSync('./optical_clinic.db');
        console.log('Existing database deleted.');
    }
} catch(err) {
    console.error('Error deleting database:', err);
}

// Initialize SQLite database
const db = new sqlite3.Database('./optical_clinic.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        // Create patients table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            right_eye_number TEXT,
            left_eye_number TEXT,
            patient_history TEXT,
            last_checkup_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Routes - Make sure these come BEFORE the static middleware
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/records', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'records.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// API Routes
app.post('/api/patients', [
    body('name').notEmpty().withMessage('Name is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('address').notEmpty().withMessage('Address is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, date, phone, address, right_eye_number, left_eye_number, patient_history, last_checkup_date } = req.body;
    
    const sql = `INSERT INTO patients (name, date, phone, address, right_eye_number, left_eye_number, patient_history, last_checkup_date) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [name, date, phone, address, right_eye_number, left_eye_number, patient_history, last_checkup_date], function(err) {
        if (err) {
            console.error('Error inserting patient:', err.message);
            res.status(500).json({ error: 'Failed to register patient' });
        } else {
            res.json({ 
                message: 'Patient registered successfully', 
                patientId: this.lastID 
            });
        }
    });
});

// Get all patients
app.get('/api/patients', (req, res) => {
    const sql = 'SELECT * FROM patients ORDER BY created_at DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching patients:', err.message);
            res.status(500).json({ error: 'Failed to fetch patients' });
        } else {
            res.json(rows);
        }
    });
});

// Search patients by name
app.get('/api/patients/search', (req, res) => {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
        return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }
    
    const sql = 'SELECT * FROM patients WHERE name LIKE ? OR phone LIKE ? ORDER BY created_at DESC';
    const searchTerm = `%${query.trim()}%`;
    
    db.all(sql, [searchTerm, searchTerm], (err, rows) => {
        if (err) {
            console.error('Error searching patients:', err.message);
            res.status(500).json({ error: 'Failed to search patients' });
        } else {
            res.json(rows);
        }
    });
});

// Get patient by ID
app.get('/api/patients/:id', (req, res) => {
    const patientId = req.params.id;
    
    if (!patientId || isNaN(patientId)) {
        return res.status(400).json({ error: 'Invalid patient ID' });
    }
    
    const sql = 'SELECT * FROM patients WHERE id = ?';
    
    db.get(sql, [patientId], (err, row) => {
        if (err) {
            console.error('Error fetching patient:', err.message);
            res.status(500).json({ error: 'Failed to fetch patient' });
        } else if (!row) {
            res.status(404).json({ error: 'Patient not found' });
        } else {
            res.json(row);
        }
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Optical Eye Clinic server running on:`);
    console.log(`  Local:    http://localhost:${PORT}`);
    console.log(`\nTo access from other devices, use the Network URL`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

