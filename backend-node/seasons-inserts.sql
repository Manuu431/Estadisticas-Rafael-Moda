
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
(1, 'Temporada de Verano 2019', '2019-03-01', '2019-09-01', 9727.84, 16324.92),
(2, 'Temporada de Invierno 2019-2020', '2019-09-01', '2020-03-01', 11639.19, 19498.65),
(3, 'Temporada de Verano 2020', '2020-03-01', '2020-09-01', 10166.64, 16692.82),
(4, 'Temporada de Invierno 2020-2021', '2020-09-01', '2021-03-01', 11726.29, 19446.76),
(5, 'Temporada de Verano 2021', '2021-03-01', '2021-09-01', 9479.41, 17035.91),
(6, 'Temporada de Invierno 2021-2022', '2021-09-01', '2022-03-01', 10578.97, 19649.93),
(7, 'Temporada de Verano 2022', '2022-03-01', '2022-09-01', 9035.05, 16921.92),
(8, 'Temporada de Invierno 2022-2023', '2022-09-01', '2023-03-01', 10127.11, 18731.08),
(9, 'Temporada de Verano 2023', '2023-03-01', '2023-09-01', 10350.18, 17005.94),
(10, 'Temporada de Invierno 2023-2024', '2023-09-01', '2024-03-01', 10588.22, 18992.65),
(11, 'Temporada de Verano 2024', '2024-03-01', '2024-09-01', 9405.10, 16039.98),
(12, 'Temporada de Invierno 2024-2025', '2024-09-01', '2025-03-01', 10243.46, 19783.50),
(13, 'Temporada de Verano 2025', '2025-03-01', '2025-09-01', 10392.67, 16545.14);
(14, 'Temporada de Invierno 2025-2026', '2025-09-01', '2026-03-01', 11503.74, 19668.97),
