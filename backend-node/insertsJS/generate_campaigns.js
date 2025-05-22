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

  const [campaignTypes] = await connection.query('SELECT * FROM campaign_types');
  const [existingCampaigns] = await connection.query('SELECT name FROM campaigns');
  const existingNames = new Set(existingCampaigns.map(c => c.name));

  const inserts = [];

  for (let year = START_YEAR; year <= END_YEAR; year++) {
    for (const type of campaignTypes) {
      const startDay = type.start_day;
      const startMonth = type.start_month;
      const endDay = type.end_day;
      const endMonth = type.end_month;

      const startDate = parseDate(startMonth, startDay, year);
      let endDate, campaignName;

      // Manejo de campañas que cruzan de año (ej: Navidad)
      if (endMonth < startMonth || (endMonth === startMonth && endDay < startDay)) {
        endDate = parseDate(endMonth, endDay, year + 1);
        campaignName = `${type.name} ${year}-${year + 1}`;
      } else {
        endDate = parseDate(endMonth, endDay, year);
        campaignName = `${type.name} ${year}`;
      }

      if (!existingNames.has(campaignName)) {
        const expenses = (Math.random() * 5000).toFixed(2);
        const profits = (Math.random() * 20000).toFixed(2);

        inserts.push([
          campaignName,
          startDate,
          endDate,
          expenses, // expenses
          profits, // profits
          type.id // campaign_type_id
        ]);
      }
    }
  }

  if (inserts.length > 0) {
    await connection.query(
      'INSERT INTO campaigns (name, start_date, end_date, expenses, profits, campaign_type_id) VALUES ?',
      [inserts]
    );
    console.log(`${inserts.length} campaigns inserted.`);
  } else {
    console.log('No new campaigns to insert.');
  }

  await connection.end();
}

main().catch(err => console.error('Error generating campaigns:', err));