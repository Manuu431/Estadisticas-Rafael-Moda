
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
(1, 'Temporada de Invierno 2019-2020', '2019-09-09', '2020-03-12', 11239.17, 18833.10),
(2, 'Temporada de Verano 2019', '2019-03-12', '2019-09-09', 9645.24, 17726.69),
(3, 'Temporada de Invierno 2020-2021', '2020-09-09', '2021-03-12', 10909.68, 19250.16),
(4, 'Temporada de Verano 2020', '2020-03-12', '2020-09-09', 9721.21, 16331.94),
(5, 'Temporada de Invierno 2021-2022', '2021-09-09', '2022-03-12', 10371.80, 19290.65),
(6, 'Temporada de Verano 2021', '2021-03-12', '2021-09-09', 10538.26, 17838.60),
(7, 'Temporada de Invierno 2022-2023', '2022-09-09', '2023-03-12', 10078.77, 18985.87),
(8, 'Temporada de Verano 2022', '2022-03-12', '2022-09-09', 10149.27, 16694.31),
(9, 'Temporada de Invierno 2023-2024', '2023-09-09', '2024-03-12', 10871.44, 18256.58),
(10, 'Temporada de Verano 2023', '2023-03-12', '2023-09-09', 9542.62, 17890.26),
(11, 'Temporada de Invierno 2024-2025', '2024-09-09', '2025-03-12', 10166.14, 18581.87),
(12, 'Temporada de Verano 2024', '2024-03-12', '2024-09-09', 9854.18, 16522.05),
(13, 'Temporada de Invierno 2025-2026', '2025-09-09', '2026-03-12', 11221.15, 18142.88),
(14, 'Temporada de Verano 2025', '2025-03-12', '2025-09-09', 9844.85, 16821.19);
