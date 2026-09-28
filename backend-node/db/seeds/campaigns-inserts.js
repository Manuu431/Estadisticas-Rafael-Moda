const fs = require('fs');

const campaignTypes = [
  { id: 1, name: "Campaña Día de San Valentín" },
  { id: 2, name: "Campaña Verano" },
  { id: 3, name: "Campaña Navidad" },
  { id: 4, name: "Campaña Rebajas Invierno" },
  { id: 5, name: "Campaña Black Friday" },
  { id: 6, name: "Campaña Primavera" },
  { id: 7, name: "Campaña Otoño" }
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
  const date = new Date(dateStr);
  const newDate = new Date(date.getTime() + Math.floor(Math.random() * (20 * 24 * 60 * 60 * 1000)) + 1);
  return formatDateISO(newDate);
}

let sql = `
DROP TABLE IF EXISTS campaigns;
CREATE TABLE campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  start_date DATE,
  end_date DATE,
  expenses DECIMAL(10,2),
  profits DECIMAL(10,2),
  campaign_type_id INT,
  FOREIGN KEY (campaign_type_id) REFERENCES campaign_types(id)
);

INSERT INTO campaigns (name, start_date, end_date, expenses, profits, campaign_type_id) VALUES
`;

for (let i = 1; i <= 50; i++) {
  const campaign = getRandom(campaignTypes);
  const startDate = getRandomDateISO(2023, 2025);
  const endDate = getRandomDateAfterISO(startDate);
  const expenses = (Math.random() * 5000).toFixed(2);
  const profits = (Math.random() * 20000).toFixed(2);

  sql += `('${campaign.name}', '${startDate}', '${endDate}', ${expenses}, ${profits}, ${campaign.id})${i < 50 ? ',' : ';'}\n`;
}

fs.mkdirSync(`${__dirname}/../inserts`, { recursive: true });
fs.writeFileSync(`${__dirname}/../inserts/campaigns-inserts.sql`, sql, { encoding: 'utf8' });

console.log("File 'campaigns-inserts.sql' generated successfully.");