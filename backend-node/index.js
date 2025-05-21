const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'estadisticas_rafael_moda_bbdd',
    dateStrings: true
});

db.connect(err => {
    if (err) {
        console.error(`Error connecting to MySQL: ${err}`);
        return;
    }
    console.log('Connecting to the MySQL database...');
});

const allowedTables = ['campaigns', 'seasons'];

const makeGet = (endpoint) => {
    app.get(`/api/${endpoint}`, (req, res) => {
        const filters = req.query;

        let query = `SELECT * FROM ${endpoint}`;
        const conditions = [];
        const values = [];

        for (const key in filters) {
            const value = filters[key];
            if (value === undefined || value === null || value === '') continue;

            if (key.endsWith('_min') || key.startsWith('start')) {
                const column = key.replace('_min', '');
                conditions.push(`${column} >= ?`);
                values.push(value);
            } else if (key.endsWith('_max') || key.startsWith('end')) {
                const column = key.replace('_max', '');
                conditions.push(`${column} <= ?`);
                values.push(value);
            } else if (Array.isArray(value)) {
                const placeholders = value.map(() => '?').join(', ');
                conditions.push(`${key} IN (${placeholders})`);
                values.push(...value);
            } else {
                if (!isNaN(value)) {
                    conditions.push(`${key} = ?`);
                    values.push(parseFloat(value));
                } else {
                    if (key === 'size') {
                        conditions.push(`${key} LIKE ?`);
                        values.push(`${value}`);
                    } else {
                        conditions.push(`${key} LIKE ?`);
                        values.push(`%${value}%`);
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

const makePost = (endpoint) => {
    if (!allowedTables.includes(endpoint)) return;
    app.post(`/api/${endpoint}`, (req, res) => {
        const data = req.body;
        const query = `INSERT INTO ${endpoint} SET ?`;
        db.query(query, data, (err, results) => {
            if (err) {
                console.error(`Error creating ${endpoint}: ${err}`);
                return res.status(500).json({ error: 'Server error' });
            }
            res.json(results);
        });
    });
};

const makeUpdate = (endpoint) => {
    if (!allowedTables.includes(endpoint)) return;
    app.put(`/api/${endpoint}/:id`, (req, res) => {
        const data = req.body;
        const id = req.params.id;
        const query = `UPDATE ${endpoint} SET ? WHERE id = ?`;
        db.query(query, [data, id], (err, results) => {
            if (err) {
                console.error(`Error updating ${endpoint}: ${err}`);
                return res.status(500).json({ error: 'Server error' });
            }
            res.json(results);
        });
    });
};

const makeDelete = (endpoint) => {
    if (!allowedTables.includes(endpoint)) return;
    app.delete(`/api/${endpoint}/:id`, (req, res) => {
        const id = req.params.id;
        const query = `DELETE FROM ${endpoint} WHERE id = ?`;
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error(`Error deleting from ${endpoint}: ${err}`);
                return res.status(500).json({ error: 'Server error' });
            }
            res.json(results);
        });
    });
};

makeGet('sales');
makeGet('clients');
makeGet('campaigns');
makeGet('seasons');

makePost('campaigns');
makePost('seasons');

makeUpdate('campaigns');
makeUpdate('seasons');

makeDelete('campaigns');
makeDelete('seasons');

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});