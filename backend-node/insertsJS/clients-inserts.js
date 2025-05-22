const fs = require('fs');

const provincesWithCities = {
  'Madrid': ['Madrid', 'Alcalá de Henares', 'Getafe', 'Leganés', 'Móstoles'],
  'Barcelona': ['Barcelona', 'Hospitalet de Llobregat', 'Badalona', 'Sabadell', 'Terrassa'],
  'Valencia': ['Valencia', 'Gandía', 'Torrent', 'Paterna', 'Ontinyent'],
  'Sevilla': ['Sevilla', 'Dos Hermanas', 'Alcalá de Guadaíra', 'Utrera', 'Camas'],
  'Zaragoza': ['Zaragoza', 'Calatayud', 'Utebo', 'Ejea de los Caballeros', 'La Almunia de Doña Godina'],
  'Malaga': ['Málaga', 'Marbella', 'Mijas', 'Fuengirola', 'Benalmádena'],
  'Murcia': ['Murcia', 'Cartagena', 'Lorca', 'Molina de Segura', 'San Javier']
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createPostalCodeGenerator() {
  const provinceCodes = {
    'Madrid': '28',
    'Barcelona': '08',
    'Valencia': '46',
    'Sevilla': '41',
    'Zaragoza': '50',
    'Malaga': '29',
    'Murcia': '30'
  };
  return function(province) {
    const provinceCode = provinceCodes[province] || '00';
    const lastThree = Math.floor(Math.random() * 900) + 100; // 100-999
    return provinceCode + lastThree.toString();
  }
}

const generatePostalCode = createPostalCodeGenerator();

let sql = `
DROP TABLE IF EXISTS clients;
CREATE TABLE clients (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  postal_code VARCHAR(10),
  province VARCHAR(50),
  city VARCHAR(50)
);

INSERT INTO clients (id, name, postal_code, province, city) VALUES
`;

const provinces = Object.keys(provincesWithCities);

for (let i = 1; i <= 50; i++) {
  const province = getRandom(provinces);
  const city = getRandom(provincesWithCities[province]);
  const postalCode = generatePostalCode(province);
  const name = `Cliente ${i}`;

  sql += `(${i}, '${name}', '${postalCode}', '${province}', '${city}')${i < 50 ? ',' : ';'}\n`;
}

fs.writeFileSync('../insertsSQL/clients-inserts.sql', sql, { encoding: 'utf8' });

console.log("File 'clients-inserts.sql' generated successfully.");