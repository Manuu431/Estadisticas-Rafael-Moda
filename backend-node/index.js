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

const allowedTables = ['campaigns', 'seasons', 'season_types', 'campaign_types'];

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
  app.post(`/api/${endpoint}`, async (req, res) => {
    let data = req.body;

    if (endpoint === 'seasons') {
      data = normalizeDecimalFields(data, ['expenses', 'profits']);
    }

    try {
      if (endpoint === 'season_types' || endpoint === 'campaign_types') {
        const [result] = await db.promise().query(`INSERT INTO ${endpoint} SET ?`, data);
        const newId = result.insertId;

        const [[newSeasonType]] = await db.promise().query(`SELECT * FROM season_types WHERE id = ?`, [newId]);

        const startYear = newSeasonType.start_year || new Date().getFullYear();
        const endYear = new Date().getFullYear();

        const formatDateISO = (date) => {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${year}-${month}-${day}`;
        };

        const parseDate = (month, day, year) => {
          const date = new Date(year, month - 1, day);
          return formatDateISO(date);
        };

        const inserts = [];

        for (let year = startYear; year <= endYear; year++) {
          const startDay = newSeasonType.start_day;
          const startMonth = newSeasonType.start_month;
          const endDay = newSeasonType.end_day;
          const endMonth = newSeasonType.end_month;

          const startDate = parseDate(startMonth, startDay, year);

          let endDate, seasonName;

          if (endMonth < startMonth || (endMonth === startMonth && endDay < startDay)) {
            endDate = parseDate(endMonth, endDay, year + 1);
            seasonName = `${newSeasonType.name} ${year}-${year + 1}`;
          } else {
            endDate = parseDate(endMonth, endDay, year);
            seasonName = `${newSeasonType.name} ${year}`;
          }

          inserts.push([
            seasonName,
            startDate,
            endDate,
            null,
            null,
            newId,
          ]);
        }

        if (inserts.length > 0) {
          await db.promise().query(
            'INSERT INTO seasons (name, start_date, end_date, expenses, profits, season_type_id) VALUES ?',
            [inserts]
          );
        }

        return res.json({ message: 'Season type and seasons created', season_type_id: newId });
      } else {
        const [results] = await db.promise().query(`INSERT INTO ${endpoint} SET ?`, data);
        return res.json(results);
      }
    } catch (err) {
      console.error(`Error creating ${endpoint}:`, err);
      return res.status(500).json({ error: 'Server error' });
    }
  });
};

const makeUpdate = (endpoint) => {
    if (!allowedTables.includes(endpoint)) return;
    app.put(`/api/${endpoint}/:id`, (req, res) => {
        let data = req.body;
        const id = req.params.id;

        if (endpoint === 'seasons' || endpoint === 'campaigns') {
            data = normalizeDecimalFields(data, ['expenses', 'profits']);
        }

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
makeGet('season_types');
makeGet('campaign_types');

makePost('campaigns');
makePost('seasons');
makePost('season_types');
makePost('campaign_types');

makeUpdate('campaigns');
makeUpdate('seasons');
makeUpdate('season_types');
makeUpdate('campaign_types');

makeDelete('campaigns');
makeDelete('seasons');
makeDelete('season_types');
makeDelete('campaign_types');

const normalizeDecimalFields = (data, fields) => {
    const newData = { ...data };
    fields.forEach((field) => {
        if (newData[field] === '' || newData[field] === undefined || newData[field] === null) {
            newData[field] = null;
        } else {
            newData[field] = parseFloat(newData[field]);
        }
    });
    return newData;
};

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});