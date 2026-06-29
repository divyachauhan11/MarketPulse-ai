const checkAuth = require('./middleware/auth');
app.post('/api/research', checkAuth, (req, res) => {

    res.json({ message: `Processing research for ${req.user.email}` });
});


const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: "healthy", service: "Backend Gateway" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Gateway routing traffic on port ${PORT}`);
});