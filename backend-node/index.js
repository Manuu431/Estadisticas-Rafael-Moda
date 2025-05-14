const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 8000;

const makeGet = (endpoint) => {
    app.get(`/api/${endpoint}`, (req, res) => {
        const filters = req.query;

        let query = `SELECT * FROM ${endpoint}`;
        const conditions = [];
        const values = [];

        for (const key in filters) {
            const value = filters[key];

            if (Array.isArray(value)) {
                const placeholders = value.map(() => '?').join(', ');
                conditions.push(`${key} IN (${placeholders})`);
                values.push(...value);
            } else {
                if (isNaN(value)) {
                    conditions.push(`${key} LIKE ?`);
                    values.push(`%${value}%`);
                } else {
                    const numberValue = parseFloat(value);
                    if (key.includes('min') || key.includes('max')) {
                        if (filters.min && filters.max) {
                            conditions.push(`${key} BETWEEN ? AND ?`);
                            values.push(filters.min);
                            values.push(filters.max);
                        }
                    } else {
                        conditions.push(`${key} = ?`);
                        values.push(numberValue);
                    }
                }
            }
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        db.query(query, values, (err, results) => {
            if (err) {
                console.error(`Error obtaining ${endpoint} data: ${err}`);
                return res.status(500).json({ error: 'Server error' });
            }

            res.json(results);
        });
    });
};

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
makeGet('campaigns');
makeGet('seasons');

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});