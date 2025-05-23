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

const formatDateISO = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const parseDate = (m, d, y) => formatDateISO(new Date(y, m - 1, d));

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

    if (endpoint === 'seasons' || endpoint === 'campaigns') {
      data = normalizeDecimalFields(data, ['expenses', 'profits']);
    }

    try {
      if (endpoint === 'season_types') {
        const [result] = await db.promise().query(`INSERT INTO season_types SET ?`, data);
        const newId = result.insertId;
        const [[newType]] = await db.promise().query(`SELECT * FROM season_types WHERE id = ?`, [newId]);

        const startYear = newType.start_year || new Date().getFullYear();
        const endYear = new Date().getFullYear();

        const formatDateISO = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const parseDate = (m, d, y) => formatDateISO(new Date(y, m - 1, d));

        const inserts = [];
        for (let year = startYear; year <= endYear; year++) {
          const startDate = parseDate(newType.start_month, newType.start_day, year);
          const isNextYear = newType.end_month < newType.start_month || (newType.end_month === newType.start_month && newType.end_day < newType.start_day);
          const endDate = parseDate(newType.end_month, newType.end_day, isNextYear ? year + 1 : year);
          const name = isNextYear ? `${newType.name} ${year}-${year + 1}` : `${newType.name} ${year}`;
          inserts.push([name, startDate, endDate, null, null, newId]);
        }

        if (inserts.length > 0) {
          await db.promise().query('INSERT INTO seasons (name, start_date, end_date, expenses, profits, season_type_id) VALUES ?', [inserts]);
        }

        return res.json({ message: 'Season type and seasons created', season_type_id: newId });

      } else if (endpoint === 'campaign_types') {
        const [result] = await db.promise().query(`INSERT INTO campaign_types SET ?`, data);
        const newId = result.insertId;
        const [[newType]] = await db.promise().query(`SELECT * FROM campaign_types WHERE id = ?`, [newId]);

        const startYear = newType.start_year || new Date().getFullYear();
        const endYear = new Date().getFullYear();

        const formatDateISO = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const parseDate = (m, d, y) => formatDateISO(new Date(y, m - 1, d));

        const inserts = [];
        for (let year = startYear; year <= endYear; year++) {
          const startDate = parseDate(newType.start_month, newType.start_day, year);
          const isNextYear = newType.end_month < newType.start_month || (newType.end_month === newType.start_month && newType.end_day < newType.start_day);
          const endDate = parseDate(newType.end_month, newType.end_day, isNextYear ? year + 1 : year);
          const name = isNextYear ? `${newType.name} ${year}-${year + 1}` : `${newType.name} ${year}`;
          inserts.push([name, startDate, endDate, null, null, newId]);
        }

        if (inserts.length > 0) {
          await db.promise().query('INSERT INTO campaigns (name, start_date, end_date, expenses, profits, campaign_type_id) VALUES ?', [inserts]);
        }

        return res.json({ message: 'Campaign type and campaigns created', campaign_type_id: newId });

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

const makeSyncPost = ({ endpoint, typeTable, targetTable, foreignKey }) => {
  app.post(`/api/${endpoint}/sync`, async (req, res) => {
    try {
      const [types] = await db.promise().query(`SELECT * FROM ${typeTable}`);
      const [existingEntries] = await db.promise().query(`SELECT ${foreignKey}, start_date FROM ${targetTable}`);

      const currentYear = new Date().getFullYear();
      const existingKeys = new Set(
        existingEntries.map(e => `${e[foreignKey]}-${new Date(e.start_date).getFullYear()}`)
      );

      const inserts = [];

      for (const type of types) {
        const startYear = type.start_year || 2000;
        for (let year = startYear; year <= currentYear; year++) {
          const key = `${type.id}-${year}`;
          if (!existingKeys.has(key)) {
            const isNextYear =
              type.end_month < type.start_month ||
              (type.end_month === type.start_month && type.end_day < type.start_day);

            const name = isNextYear ? `${type.name} ${year}-${year + 1}` : `${type.name} ${year}`;
            const startDate = parseDate(type.start_month, type.start_day, year);
            const endDate = parseDate(type.end_month, type.end_day, isNextYear ? year + 1 : year);

            inserts.push([name, startDate, endDate, null, null, type.id]);
          }
        }
      }

      if (inserts.length > 0) {
        await db
          .promise()
          .query(
            `INSERT INTO ${targetTable} (name, start_date, end_date, expenses, profits, ${foreignKey}) VALUES ?`,
            [inserts]
          );
      }

      res.json({ message: `${targetTable} up to date.` });
    } catch (err) {
      console.error(`Error syncing ${typeTable} -> ${targetTable}:`, err);
      res.status(500).json({ error: 'Server error' });
    }
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

makeSyncPost({
  endpoint: 'campaign_types',
  typeTable: 'campaign_types',
  targetTable: 'campaigns',
  foreignKey: 'campaign_type_id',
});

makeSyncPost({
  endpoint: 'season_types',
  typeTable: 'season_types',
  targetTable: 'seasons',
  foreignKey: 'season_type_id',
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});