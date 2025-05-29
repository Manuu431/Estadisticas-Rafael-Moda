const fs = require('fs');

const campaignTypes = [
  { id: 1, name: "Reyes", start_day: 26, start_month: 12, end_day: 5, end_month: 1, start_year: 2020 },
  { id: 2, name: "Rebajas de enero", start_day: 7, start_month: 1, end_day: 28, end_month: 2, start_year: 2020 },
  { id: 3, name: "Día de los enamorados", start_day: 1, start_month: 2, end_day: 14, end_month: 2, start_year: 2020 },
  { id: 4, name: "Día del padre", start_day: 1, start_month: 3, end_day: 18, end_month: 3, start_year: 2020 },
  { id: 5, name: "Comuniones", start_day: 1, start_month: 3, end_day: 15, end_month: 5, start_year: 2020 },
  { id: 6, name: "Día de la madre", start_day: 20, start_month: 4, end_day: 3, end_month: 5, start_year: 2020 },
  { id: 7, name: "Feria de junio", start_day: 5, start_month: 6, end_day: 13, end_month: 6, start_year: 2020 },
  { id: 8, name: "Rebajas de julio", start_day: 1, start_month: 7, end_day: 31, end_month: 7, start_year: 2020 },
  { id: 9, name: "Rebajas de agosto", start_day: 1, start_month: 8, end_day: 31, end_month: 8, start_year: 2020 },
  { id: 10, name: "Mocadorà de octubre", start_day: 1, start_month: 10, end_day: 8, end_month: 10, start_year: 2020 },
  { id: 11, name: "Navidad", start_day: 1, start_month: 12, end_day: 24, end_month: 12, start_year: 2020 },
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