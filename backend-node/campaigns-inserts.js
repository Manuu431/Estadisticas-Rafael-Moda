const fs = require('fs');

const campaignNames = [
  "Campaña Día de San Valentín",
  "Campaña Verano",
  "Campaña Navidad",
  "Campaña Rebajas Invierno",
  "Campaña Black Friday",
  "Campaña Primavera",
  "Campaña Otoño"
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatDateISO(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

function getRandomDateISO(startYear = 2023, endYear = 2025) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  const date = new Date(start + Math.random() * (end - start));
  return formatDateISO(date);
}

function getRandomDateAfterISO(dateStr) {
  // dateStr en formato YYYY-MM-DD
  const date = new Date(dateStr);
  // Suma aleatoria hasta 20 días
  const newDate = new Date(date.getTime() + Math.floor(Math.random() * (20 * 24 * 60 * 60 * 1000)) + 1);
  return formatDateISO(newDate);
}

let sql = `
DROP TABLE IF EXISTS campaigns;
CREATE TABLE campaigns (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  start_date DATE,
  end_date DATE,
  expenses DECIMAL(10,2),
  profits DECIMAL(10,2)
);

INSERT INTO campaigns (id, name, start_date, end_date, expenses, profits) VALUES
`;

for (let i = 1; i <= 50; i++) {
  const name = getRandom(campaignNames);
  const startDate = getRandomDateISO(2023, 2025);
  const endDate = getRandomDateAfterISO(startDate);
  const expenses = (Math.random() * 5000).toFixed(2);
  const profits = (Math.random() * 20000).toFixed(2);

  sql += `(${i}, '${name}', '${startDate}', '${endDate}', ${expenses}, ${profits})${i < 50 ? ',' : ';'}\n`;
}

fs.writeFileSync('campaigns-inserts.sql', sql, { encoding: 'utf8' });

console.log("File 'campaigns-inserts.sql' generated successfully.");