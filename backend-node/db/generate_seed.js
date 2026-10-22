const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'seed.sql');
const START = new Date(2020, 0, 1);
const END = new Date();
END.setHours(0, 0, 0, 0);
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_HASH = '$2b$10$3EK44uMLrzTOerbezmUfB.dTF5jnwXLck5fAi7od4KjiRr6jSUa16';
const CLIENT_COUNT = 486;
const DAILY_BASE = 810;
const AVG_TICKET = 150;

let seedState = 20260930;
const rnd = () => {
  seedState = (seedState + 0x6d2b79f5) | 0;
  let t = Math.imul(seedState ^ (seedState >>> 15), 1 | seedState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const between = (min, max) => min + rnd() * (max - min);
const intBetween = (min, max) => Math.floor(between(min, max + 1));
const pick = (list) => list[Math.floor(rnd() * list.length)];
const weighted = (list) => {
  const total = list.reduce((sum, item) => sum + item[1], 0);
  let mark = rnd() * total;
  for (const item of list) {
    mark -= item[1];
    if (mark <= 0) return item[0];
  }
  return list[list.length - 1][0];
};
const round2 = (value) => Math.round(value * 100) / 100;
const esc = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
const pad = (value) => String(value).padStart(2, '0');
const isoDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const isoStamp = (date) => `${isoDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

const BRANDS = ['Escorpión', 'Kleymac', 'Lois', 'Massana', 'Naf Naf', 'Paz Torras', 'Pertegaz', 'Sinigual', 'Victorio & Lucchino'];
const BRAND_TIER = { 'Victorio & Lucchino': 1.45, Pertegaz: 1.3, Massana: 1.2, 'Paz Torras': 1.1, Escorpión: 1, Kleymac: 0.92, Lois: 0.85, 'Naf Naf': 0.8, Sinigual: 0.78 };
const BRANDS_BY_SECTION = {
  mujer: ['Paz Torras', 'Massana', 'Victorio & Lucchino', 'Sinigual', 'Naf Naf', 'Escorpión', 'Lois'],
  hombre: ['Lois', 'Kleymac', 'Pertegaz', 'Escorpión']
};
const FAMILIES = [
  ['Vestidos', 'Vestidos'],
  ['Faldas', 'Faldas'],
  ['Blusas', 'Blusas y camisas'],
  ['Camisas', 'Blusas y camisas'],
  ['Pantalones', 'Pantalones y vaqueros'],
  ['Vaqueros', 'Pantalones y vaqueros'],
  ['Americanas', 'Chaquetas y americanas'],
  ['Abrigos', 'Chaquetas y americanas'],
  ['Jerséis', 'Punto'],
  ['Complementos', 'Complementos']
];
const COLORS = ['Negro', 'Azul marino', 'Camel', 'Gris', 'Blanco', 'Burdeos', 'Crudo', 'Marfil', 'Verde botella', 'Azul noche', 'Beige', 'Gris marengo', 'Estampado', 'Azul celeste', 'Marrón', 'Verde oliva', 'Azul oscuro', 'Azul claro'];
const SIZES = {
  alpha: ['S', 'M', 'L', 'XL'],
  unica: ['Única'],
  num: { mujer: ['36', '38', '40', '42', '44', '46'], hombre: ['40', '42', '44', '46', '48', '50'] }
};
const TEMPLATES = [
  ['Vestido de fiesta', 'Vestidos', 'mujer', 'num', 199, 6],
  ['Vestido midi', 'Vestidos', 'mujer', 'num', 129, 9],
  ['Vestido de punto', 'Vestidos', 'mujer', 'alpha', 65, 8],
  ['Falda midi', 'Faldas', 'mujer', 'num', 79, 7],
  ['Falda plisada', 'Faldas', 'mujer', 'num', 69, 5],
  ['Blusa de seda', 'Blusas', 'mujer', 'num', 89, 7],
  ['Blusa estampada', 'Blusas', 'mujer', 'num', 55, 8],
  ['Blusa lazada', 'Blusas', 'mujer', 'num', 45, 6],
  ['Camisa entallada', 'Camisas', 'mujer', 'num', 55, 6],
  ['Pantalón de pinza', 'Pantalones', 'mujer', 'num', 72, 8],
  ['Pantalón palazzo', 'Pantalones', 'mujer', 'num', 68, 5],
  ['Vaquero recto', 'Vaqueros', 'mujer', 'num', 59, 8],
  ['Vaquero slim', 'Vaqueros', 'mujer', 'num', 59, 7],
  ['Americana entallada', 'Americanas', 'mujer', 'num', 139, 5],
  ['Abrigo de lana', 'Abrigos', 'mujer', 'num', 205, 5],
  ['Abrigo de paño', 'Abrigos', 'mujer', 'num', 215, 4],
  ['Jersey de punto', 'Jerséis', 'mujer', 'alpha', 69, 9],
  ['Jersey cuello alto', 'Jerséis', 'mujer', 'alpha', 62, 7],
  ['Bufanda de lana', 'Complementos', 'mujer', 'unica', 35, 5],
  ['Bolso de piel', 'Complementos', 'mujer', 'unica', 89, 4],
  ['Camisa Oxford', 'Camisas', 'hombre', 'alpha', 65, 9],
  ['Camisa de cuadros', 'Camisas', 'hombre', 'alpha', 55, 7],
  ['Pantalón chino', 'Pantalones', 'hombre', 'num', 70, 9],
  ['Pantalón de vestir', 'Pantalones', 'hombre', 'num', 85, 5],
  ['Vaquero recto', 'Vaqueros', 'hombre', 'num', 62, 9],
  ['Vaquero slim', 'Vaqueros', 'hombre', 'num', 62, 7],
  ['Jersey cuello pico', 'Jerséis', 'hombre', 'alpha', 75, 8],
  ['Jersey cuello alto', 'Jerséis', 'hombre', 'alpha', 72, 6],
  ['Americana', 'Americanas', 'hombre', 'num', 209, 5],
  ['Abrigo de paño', 'Abrigos', 'hombre', 'num', 239, 4],
  ['Cinturón de piel', 'Complementos', 'hombre', 'unica', 49, 6],
  ['Corbata de seda', 'Complementos', 'hombre', 'unica', 39, 4]
];
const PERIOD_TYPES = [
  ['campaign', 'Rebajas de invierno', 7, 1, 28, 2, 2020, 1, 380],
  ['campaign', 'San Valentín', 1, 2, 14, 2, 2022, 1, 120],
  ['campaign', 'Comuniones', 15, 4, 31, 5, 2020, 1, 300],
  ['campaign', 'Día de la Madre', 20, 4, 3, 5, 2021, 1, 150],
  ['campaign', 'Rebajas de verano', 1, 7, 31, 8, 2020, 1, 520],
  ['campaign', 'Presentación Otoño-Invierno', 15, 9, 12, 10, 2023, 1, 450],
  ['campaign', 'Black Friday', 27, 11, 30, 11, 2020, 1, 250],
  ['campaign', 'Navidad y Reyes', 5, 12, 6, 1, 2020, 1, 600],
  ['campaign', '50 aniversario', 3, 5, 20, 5, 2026, 0, 900],
  ['season', 'Primavera-Verano', 1, 3, 31, 8, 2020, 1, 3200],
  ['season', 'Otoño-Invierno', 1, 9, 28, 2, 2020, 1, 3600]
];
const FIRST_NAMES = ['Alicia', 'Amparo', 'Andrés', 'Beatriz', 'Carmen', 'Consuelo', 'Elena', 'Enrique', 'Francisco', 'Inmaculada', 'Josep', 'Lucía', 'Manuel', 'María', 'Miguel', 'Nuria', 'Pilar', 'Rafael', 'Rosa', 'Salvador', 'Teresa', 'Vicente', 'Ana', 'Jorge', 'Marta', 'Pau', 'Sara', 'Javier', 'Clara', 'Óscar', 'Irene', 'Ramón', 'Silvia', 'Tomás', 'Verónica', 'Alberto', 'Noelia', 'Sergio', 'Patricia', 'Ignacio'];
const SURNAMES = ['Server', 'Llorca', 'Martí', 'Sanchis', 'Ferrer', 'Pastor', 'Morant', 'Gil', 'Moll', 'Costa', 'Escrivà', 'Fuster', 'Peiró', 'Roig', 'Mas', 'Vidal', 'Bataller', 'Sendra', 'Frau', 'Garcia', 'Ripoll', 'Tormo', 'Cardona', 'Boronat', 'Savall', 'Mengual', 'Ivars', 'Signes', 'Gadea', 'Fornés', 'Cabanes', 'Alemany', 'Puig', 'Grau', 'Blasco', 'Aparisi', 'Català', 'Domínguez', 'Pla', 'Soler'];
const TOWNS = [
  ['Oliva', 'Valencia', '46780', 34],
  ['Gandia', 'Valencia', '46701', 22],
  ['Pego', 'Alicante', '03780', 9],
  ['Dénia', 'Alicante', '03700', 8],
  ['Tavernes de la Valldigna', 'Valencia', '46760', 6],
  ['Villalonga', 'Valencia', '46720', 5],
  ['Bellreguard', 'Valencia', '46713', 4],
  ['Piles', 'Valencia', '46712', 3],
  ['Xàbia', 'Alicante', '03730', 3],
  ['Ondara', 'Alicante', '03760', 3],
  ['Valencia', 'Valencia', '46004', 6],
  ['Alicante', 'Alicante', '03001', 3],
  ['Madrid', 'Madrid', '28014', 2],
  ['Barcelona', 'Barcelona', '08002', 2]
];
const MONTH_WEIGHT = [1, 0.71, 0.79, 0.92, 1.01, 0.85, 0.5, 0.33, 0.69, 0.81, 0.87, 1.14];
const YEAR_FACTOR = { 2020: 0.552, 2021: 0.801, 2022: 1, 2023: 1.064, 2024: 1.117, 2025: 1.172, 2026: 1.33 };
const DOW_WEIGHT = [0, 0.82, 0.95, 1, 1.02, 1.12, 1.35];
const HOUR_SLOTS = [[10, 0, 60, 0.8], [11, 0, 60, 1.2], [12, 0, 60, 1.1], [13, 0, 30, 0.5], [17, 0, 60, 1], [18, 0, 60, 1.5], [19, 0, 60, 1.4], [20, 0, 30, 0.6]];

const brandId = new Map(BRANDS.map((name, index) => [name, index + 1]));
const familyId = new Map(FAMILIES.map((row, index) => [row[0], index + 1]));

const products = [];
const seen = new Set();
for (const [name, family, section, sizeKind, basePrice, variants] of TEMPLATES) {
  const pool = BRANDS_BY_SECTION[section];
  for (let i = 0; i < variants; i++) {
    const brand = pick(pool);
    const color = pick(COLORS);
    const key = `${name}|${brand}|${color}|${section}`;
    if (seen.has(key)) continue;
    seen.add(key);
    products.push({
      id: products.length + 1,
      name,
      brand,
      family,
      section,
      color,
      sizeKind,
      base: round2(basePrice * BRAND_TIER[brand] * between(0.92, 1.08)),
      costRatio: between(0.46, 0.54)
    });
  }
}

const productsBySection = {
  mujer: products.filter((product) => product.section === 'mujer'),
  hombre: products.filter((product) => product.section === 'hombre')
};
const sizesFor = (product) => (product.sizeKind === 'num' ? SIZES.num[product.section] : SIZES[product.sizeKind]);
const isSalePeriod = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month === 1 && day >= 7) return true;
  if (month === 2) return true;
  if (month === 7 || month === 8) return true;
  if (month === 11 && day >= 27) return true;
  return false;
};

const tickets = [];
const lines = [];
const cursor = new Date(START);
while (cursor <= END) {
  const dow = cursor.getDay();
  if (dow === 0) {
    cursor.setDate(cursor.getDate() + 1);
    continue;
  }
  const year = cursor.getFullYear();
  const target = DAILY_BASE * (YEAR_FACTOR[year] || 1.33) * MONTH_WEIGHT[cursor.getMonth()] * DOW_WEIGHT[dow] * between(0.72, 1.3);
  const onSale = isSalePeriod(cursor);
  const ticketCount = Math.max(1, Math.round(target / (AVG_TICKET * (onSale ? 0.87 : 1))));
  for (let n = 0; n < ticketCount; n++) {
    const slot = weighted(HOUR_SLOTS.map((entry) => [entry, entry[3]]));
    const stamp = new Date(cursor);
    stamp.setHours(slot[0], slot[1] + intBetween(0, slot[2] - 1), intBetween(0, 59), 0);
    const ticketId = tickets.length + 1;
    tickets.push({ id: ticketId, soldAt: stamp });
    const lineCount = weighted([[1, 60], [2, 28], [3, 9], [4, 3]]);
    for (let i = 0; i < lineCount; i++) {
      const product = pick(productsBySection[rnd() < 0.75 ? 'mujer' : 'hombre']);
      const units = weighted([[1, 90], [2, 9], [3, 1]]);
      const discount = onSale && rnd() < 0.65 ? between(0.65, 0.8) : 1;
      const unitPrice = round2(product.base * discount);
      const unitCost = round2(product.base * product.costRatio);
      lines.push({
        ticketId,
        productId: product.id,
        size: pick(sizesFor(product)),
        units,
        unitPrice,
        unitCost
      });
    }
  }
  cursor.setDate(cursor.getDate() + 1);
}
tickets.sort((a, b) => a.soldAt - b.soldAt);
const ticketOrder = new Map(tickets.map((ticket, index) => [ticket.id, index + 1]));

const clients = [];
const usedNames = new Set();
while (clients.length < CLIENT_COUNT) {
  const name = `${pick(FIRST_NAMES)} ${pick(SURNAMES)} ${pick(SURNAMES)}`;
  if (usedNames.has(name)) continue;
  usedNames.add(name);
  const town = weighted(TOWNS.map((entry) => [entry, entry[3]]));
  clients.push({ id: clients.length + 1, name, postalCode: town[2], city: town[0], province: town[1] });
}
clients.sort((a, b) => a.name.localeCompare(b.name, 'es'));

const periodTypes = [];
const periods = [];
for (const [kind, name, startDay, startMonth, endDay, endMonth, firstYear, repeats, baseExpenses] of PERIOD_TYPES) {
  const typeId = periodTypes.length + 1;
  periodTypes.push({ id: typeId, kind, name, startDay, startMonth, endDay, endMonth, firstYear, repeats });
  const lastYear = repeats ? END.getFullYear() : firstYear;
  const crosses = endMonth < startMonth || (endMonth === startMonth && endDay < startDay);
  for (let year = firstYear; year <= lastYear; year++) {
    const startDate = new Date(year, startMonth - 1, startDay);
    const endDate = new Date(crosses ? year + 1 : year, endMonth - 1, endDay);
    periods.push({
      typeId,
      startDate,
      endDate,
      expenses: startDate > END ? 0 : Math.round((baseExpenses * (YEAR_FACTOR[year] || 1.33) * between(0.85, 1.15)) / 10) * 10
    });
  }
}

const block = (table, columns, rows) => {
  if (!rows.length) return '';
  const chunks = [];
  for (let i = 0; i < rows.length; i += 400) {
    chunks.push(`INSERT INTO \`${table}\` (${columns.map((name) => `\`${name}\``).join(', ')}) VALUES\n${rows.slice(i, i + 400).map((row) => `(${row.join(',')})`).join(',\n')};`);
  }
  return `${chunks.join('\n')}\n`;
};

const out = [
  'SET NAMES utf8mb4;',
  'SET FOREIGN_KEY_CHECKS = 0;',
  'TRUNCATE TABLE `sale_lines`;',
  'TRUNCATE TABLE `tickets`;',
  'TRUNCATE TABLE `products`;',
  'TRUNCATE TABLE `families`;',
  'TRUNCATE TABLE `brands`;',
  'TRUNCATE TABLE `periods`;',
  'TRUNCATE TABLE `period_types`;',
  'TRUNCATE TABLE `clients`;',
  'TRUNCATE TABLE `users`;',
  'SET FOREIGN_KEY_CHECKS = 1;',
  block('users', ['id', 'email', 'password'], [[1, esc(ADMIN_EMAIL), esc(ADMIN_HASH)]]),
  block('clients', ['id', 'name', 'postal_code', 'city', 'province'], clients.map((row) => [row.id, esc(row.name), esc(row.postalCode), esc(row.city), esc(row.province)])),
  block('brands', ['id', 'name'], BRANDS.map((name) => [brandId.get(name), esc(name)])),
  block('families', ['id', 'name', 'category'], FAMILIES.map((row) => [familyId.get(row[0]), esc(row[0]), esc(row[1])])),
  block('products', ['id', 'name', 'brand_id', 'family_id', 'section', 'color'], products.map((row) => [row.id, esc(row.name), brandId.get(row.brand), familyId.get(row.family), esc(row.section), esc(row.color)])),
  block('tickets', ['id', 'sold_at'], tickets.map((row) => [ticketOrder.get(row.id), esc(isoStamp(row.soldAt))])),
  block('sale_lines', ['ticket_id', 'product_id', 'size', 'units', 'unit_price', 'unit_cost'], lines.map((row) => [ticketOrder.get(row.ticketId), row.productId, esc(row.size), row.units, row.unitPrice.toFixed(2), row.unitCost.toFixed(2)])),
  block('period_types', ['id', 'kind', 'name', 'start_day', 'start_month', 'end_day', 'end_month', 'first_year', 'repeats'], periodTypes.map((row) => [row.id, esc(row.kind), esc(row.name), row.startDay, row.startMonth, row.endDay, row.endMonth, row.firstYear, row.repeats])),
  block('periods', ['period_type_id', 'start_date', 'end_date', 'expenses'], periods.map((row) => [row.typeId, esc(isoDate(row.startDate)), esc(isoDate(row.endDate)), row.expenses.toFixed(2)]))
].join('\n');

fs.writeFileSync(OUT, out.trimEnd(), 'utf8');
const revenue = lines.reduce((total, row) => total + row.unitPrice * row.units, 0);
const cost = lines.reduce((total, row) => total + row.unitCost * row.units, 0);
console.log(`seed.sql escrito en ${OUT}`);
console.log(`${clients.length} clientes · ${products.length} productos · ${tickets.length} tickets · ${lines.length} líneas`);
console.log(`${periodTypes.length} tipos · ${periods.length} ediciones`);
console.log(`ingresos ${revenue.toFixed(2)} € · beneficio ${(revenue - cost).toFixed(2)} € · margen ${((1 - cost / revenue) * 100).toFixed(1)} %`);