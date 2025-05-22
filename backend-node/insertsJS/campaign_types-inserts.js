const fs = require('fs');

const campaignTypes = [
  { id: 1, name: "Campaña Día de San Valentín", start_day: 1, start_month: 2, end_day: 14, end_month: 2, start_year: 2020 },
  { id: 2, name: "Campaña Navidad", start_day: 15, start_month: 12, end_day: 6, end_month: 1, start_year: 2020 },
  { id: 3, name: "Campaña Black Friday", start_day: 20, start_month: 11, end_day: 30, end_month: 11, start_year: 2020 },
];

let sql = `
DROP TABLE IF EXISTS campaign_types;
CREATE TABLE campaign_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  start_day INT,
  start_month INT,
  end_day INT,
  end_month INT,
  start_year INT
);

INSERT INTO campaign_types (id, name, start_day, start_month, end_day, end_month, start_year) VALUES
`;

sql += campaignTypes.map(c => `(${c.id}, '${c.name}', ${c.start_day}, ${c.start_month}, ${c.end_day}, ${c.end_month}, ${c.start_year})`).join(',\n') + ';';

fs.writeFileSync('../insertsSQL/campaign-types-inserts.sql', sql, { encoding: 'utf8' });

console.log("File 'campaign-types-inserts.sql' generated successfully.");