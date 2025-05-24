const fs = require('fs');

const families = ['Pantalón', 'Camiseta', 'Vestido', 'Falda', 'Abrigo', 'Sudadera', 'Chaqueta'];
const models = ['Vaquero', 'Slim', 'Casual', 'Formal', 'Deportiva', 'Elegante', 'Básica', 'Corta'];
const colors = ['Azul', 'Negro', 'Blanco', 'Rojo', 'Gris', 'Verde', 'Beige', 'Amarillo'];
const sizes = ['XXS', 'S', 'M', 'L', 'XL', 'XXL'];
const brands = ['Kleymac', 'Massana', 'Escorpion', 'Naf naf', 'Lois', 'Paz torras', 'Victorio & lucchino', 'Pertegaz'];

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function getRandomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const iso = date.toISOString().split('T')[0];
    return iso;
}

let sql = `DROP TABLE IF EXISTS sales;\n\n`;

sql += `CREATE TABLE sales (
    id INT PRIMARY KEY,
    model VARCHAR(50),
    family VARCHAR(50),
    color VARCHAR(30),
    size VARCHAR(10),
    brand VARCHAR(50),
    pvd DECIMAL(10,2),
    pvp DECIMAL(10,2),
    units INT,
    discount DECIMAL(10,2),
    profit DECIMAL(10,2),
    sale_date DATE
);\n\n`;

sql += `INSERT INTO sales (id, model, family, color, size, brand, pvd, pvp, units, discount, profit, sale_date) VALUES\n`;

const startDate = new Date('2020-01-01');
const endDate = new Date('2025-05-17');
const numSales = 3000;

for (let i = 1; i <= numSales; i++) {
    const model = getRandom(models);
    const family = getRandom(families);
    const color = getRandom(colors);
    const size = getRandom(sizes);
    const brand = getRandom(brands);
    const pvd = getRandomNumber(8, 35);
    const pvp = getRandomNumber(pvd + 10, pvd + 30);
    const units = Math.floor(Math.random() * 4) + 1;
    const discount = getRandomNumber(0, 10);
    const profit = ((pvp - pvd - discount) * units).toFixed(2);
    const sale_date = getRandomDate(startDate, endDate);

    sql += `(${i}, '${model}', '${family}', '${color}', '${size}', '${brand}', ${pvd}, ${pvp}, ${units}, ${discount}, ${profit}, '${sale_date}')${i < numSales ? ',' : ';'}\n`;
}

fs.writeFileSync('../insertsSQL/sales-inserts.sql', sql, { encoding: 'utf8' });

console.log("File 'sales-inserts.sql' generated successfully.");