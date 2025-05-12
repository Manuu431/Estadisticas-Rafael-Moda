const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 8000;

const makeGet = (endpoint) => {
    app.get(`/api/${endpoint}`, (req, res) => {
        const query = `SELECT * FROM ${endpoint}`;

        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error obtaining ${endpoint} data: ${err}`);
                return res.status(500).json({ error: 'Server error' });
            }

            res.json(results);
        });
    });
}

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'estadisticas_rafael_moda_bbdd'
});

db.connect(err => {
    if (err) {
        console.error(`Error connecting to MySQL: ${err}`);
        return;
    }
    console.log('Connecting to the MySQL database...');
});

makeGet('sales');
makeGet('clients');

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});