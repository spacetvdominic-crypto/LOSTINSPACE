const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// --- CONFIGURATION ---
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_WEB_APP_URL";

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

// 1. LOGIN PAGE (The first thing they see)
app.get('/', (req, res) => {
    res.render('login');
});

// 2. LOGIN LOGIC (Checks against Sheet 2)
app.get('/login', async (req, res) => {
    try {
        const { user, pass } = req.query;
        const response = await axios.get(`${GOOGLE_SCRIPT_URL}?action=login&user=${user}&pass=${pass}`);
        res.send(response.data); // Returns "success" or "invalid"
    } catch (error) {
        res.status(500).send("Login Error");
    }
});

// 3. DASHBOARD (Shows pending jobs)
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

// 4. DATA API: FETCH PENDING JOBS
app.get('/api/jobs', async (req, res) => {
    try {
        const response = await axios.get(`${GOOGLE_SCRIPT_URL}?action=getJobs`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch jobs" });
    }
});

// 5. WORK JOB PAGE (The action screen)
app.get('/work-job', (req, res) => {
    res.render('work-job');
});

// 6. RECEIPT FLIP & FINAL RECEIPT
app.get('/receipt-flip', (req, res) => res.render('receipt-flip'));
app.get('/final-receipt', (req, res) => res.render('final-receipt'));

// 7. SUBMIT UPDATE (Updates Sheet 1)
app.post('/submit-update', async (req, res) => {
    try {
        const response = await axios.post(GOOGLE_SCRIPT_URL, req.body);
        res.send("Updated");
    } catch (error) {
        res.status(500).send("Update Failed");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Space TV Portal running on port ${PORT}`));
