const fs = require('fs');

function formatDateISO(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

function formatDateDDMMYYYY(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

let sql = `
DROP TABLE IF EXISTS seasons;
CREATE TABLE seasons (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  start_date DATE,
  end_date DATE,
  expenses DECIMAL(10,2),
  profits DECIMAL(10,2)
);

INSERT INTO seasons (id, name, start_date, end_date, expenses, profits) VALUES
`;

let id = 1;
for (let year = 2019; year <= 2025; year++) {
  // Temporada Invierno: 9 septiembre año actual - 12 marzo año siguiente
  const inviernoStart = new Date(year, 8, 9);       // 9/9/yyyy
  const inviernoEnd = new Date(year + 1, 2, 12);    // 12/3/yyyy+1
  const inviernoName = `Temporada de Invierno ${year}-${year + 1}`;
  const inviernoExpenses = (10000 + Math.random() * 2000).toFixed(2);
  const inviernoProfits = (18000 + Math.random() * 2000).toFixed(2);

  sql += `(${id++}, '${inviernoName}', '${formatDateISO(inviernoStart)}', '${formatDateISO(inviernoEnd)}', ${inviernoExpenses}, ${inviernoProfits}),\n`;

  // Temporada Verano: 12 marzo - 9 septiembre mismo año
  const veranoStart = new Date(year, 2, 12);        // 12/3/yyyy
  const veranoEnd = new Date(year, 8, 9);           // 9/9/yyyy
  const veranoName = `Temporada de Verano ${year}`;
  const veranoExpenses = (9000 + Math.random() * 2000).toFixed(2);
  const veranoProfits = (16000 + Math.random() * 2000).toFixed(2);

  sql += `(${id++}, '${veranoName}', '${formatDateISO(veranoStart)}', '${formatDateISO(veranoEnd)}', ${veranoExpenses}, ${veranoProfits})${year < 2025 ? ',' : ';'}\n`;
}

fs.writeFileSync('seasons-inserts.sql', sql, { encoding: 'utf8' });

console.log("File 'seasons-inserts.sql' generated successfully.");