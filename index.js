const express = require('express');
const axios = require('axios');
const app = express();

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJAXrZ3dCNWcO14h93r9Z7SvGhEu5YDtr06n6HE9YsaCdLaZf2Z_QvZcSxnaZJ/exec";

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => res.render('login'));
app.get('/login', async (req, res) => {
    const { user, pass } = req.query;
    const resp = await axios.get(`${GOOGLE_SCRIPT_URL}?action=login&user=${user}&pass=${pass}`);
    res.send(resp.data);
});
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/api/jobs', async (req, res) => {
    const resp = await axios.get(`${GOOGLE_SCRIPT_URL}?action=getJobs`);
    res.json(resp.data);
});
app.get('/start-job', async (req, res) => {
    const { rowId } = req.query;
    await axios.get(`${GOOGLE_SCRIPT_URL}?action=startJob&rowId=${rowId}`);
    res.send("ok");
});
app.get('/work-job', (req, res) => res.render('work-job'));
app.get('/receipt-flip', (req, res) => res.render('receipt-flip'));
app.get('/final-receipt', (req, res) => res.render('final-receipt'));
app.post('/submit-update', async (req, res) => {
    const resp = await axios.post(GOOGLE_SCRIPT_URL, req.body);
    res.send(resp.data);
});

app.listen(process.env.PORT || 3000);
