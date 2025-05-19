
DROP TABLE IF EXISTS seasons;
CREATE TABLE seasons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  start_date DATE,
  end_date DATE,
  expenses DECIMAL(10,2),
  profits DECIMAL(10,2)
);

INSERT INTO seasons (id, name, start_date, end_date, expenses, profits) VALUES
(1, 'Temporada de Invierno 2019-2020', '2019-09-09', '2020-03-12', 11647.77, 18798.78),
(2, 'Temporada de Verano 2019', '2019-03-12', '2019-09-09', 10764.31, 16081.41),
(3, 'Temporada de Invierno 2020-2021', '2020-09-09', '2021-03-12', 10394.06, 18110.40),
(4, 'Temporada de Verano 2020', '2020-03-12', '2020-09-09', 10470.15, 16298.22),
(5, 'Temporada de Invierno 2021-2022', '2021-09-09', '2022-03-12', 11165.38, 18642.42),
(6, 'Temporada de Verano 2021', '2021-03-12', '2021-09-09', 9278.64, 16138.57),
(7, 'Temporada de Invierno 2022-2023', '2022-09-09', '2023-03-12', 10491.22, 19675.59),
(8, 'Temporada de Verano 2022', '2022-03-12', '2022-09-09', 9095.63, 17044.26),
(9, 'Temporada de Invierno 2023-2024', '2023-09-09', '2024-03-12', 11929.67, 19145.21),
(10, 'Temporada de Verano 2023', '2023-03-12', '2023-09-09', 10233.71, 17972.50),
(11, 'Temporada de Invierno 2024-2025', '2024-09-09', '2025-03-12', 11829.56, 19064.09),
(12, 'Temporada de Verano 2024', '2024-03-12', '2024-09-09', 9023.29, 16763.03),
(13, 'Temporada de Invierno 2025-2026', '2025-09-09', '2026-03-12', 11220.68, 19644.38),
(14, 'Temporada de Verano 2025', '2025-03-12', '2025-09-09', 9004.43, 16397.77);
