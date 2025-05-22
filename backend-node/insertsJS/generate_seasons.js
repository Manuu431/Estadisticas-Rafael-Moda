const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'estadisticas_rafael_moda_bbdd'
};

const START_YEAR = 2020;
const END_YEAR = new Date().getFullYear();

function formatDateISO(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

function parseDate(month, day, year) {
  const date = new Date(year, month - 1, day);
  return formatDateISO(date);
}

async function main() {
  const connection = await mysql.createConnection(dbConfig);

  const [seasonTypes] = await connection.query('SELECT * FROM season_types');
  const [existingSeasons] = await connection.query('SELECT name FROM seasons');
  const existingNames = new Set(existingSeasons.map(s => s.name));

  const inserts = [];

  for (let year = START_YEAR; year <= END_YEAR; year++) {
    for (const type of seasonTypes) {
      const startDay = type.start_day;
      const startMonth = type.start_month;
      const endDay = type.end_day;
      const endMonth = type.end_month;

      const startDate = parseDate(startMonth, startDay, year);
      let endDate, seasonName;

      if (endMonth < startMonth || (endMonth === startMonth && endDay < startDay)) {
        endDate = parseDate(endMonth, endDay, year + 1);
        seasonName = `${type.name} ${year}-${year + 1}`;
      } else {
        endDate = parseDate(endMonth, endDay, year);
        seasonName = `${type.name} ${year}`;
      }

      if (!existingNames.has(seasonName)) {
        inserts.push([
          seasonName,
          startDate,
          endDate,
          null, // expenses
          null, // profits
          type.id // season_type_id
        ]);
      }
    }
  }

  if (inserts.length > 0) {
    await connection.query(
      'INSERT INTO seasons (name, start_date, end_date, expenses, profits, season_type_id) VALUES ?',
      [inserts]
    );
    console.log(`${inserts.length} seasons inserted.`);
  } else {
    console.log('No new seasons to insert.');
  }

  await connection.end();
}

main().catch(err => console.error('Error generating seasons:', err));