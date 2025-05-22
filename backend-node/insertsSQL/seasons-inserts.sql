
DROP TABLE IF EXISTS seasons;
CREATE TABLE seasons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  start_date DATE,
  end_date DATE,
  expenses DECIMAL(10,2),
  profits DECIMAL(10,2),
  season_type_id INT,
  FOREIGN KEY (season_type_id) REFERENCES season_types(id)
);

INSERT INTO seasons (id, name, start_date, end_date, expenses, profits, season_type_id) VALUES
(1, 'Temporada de Verano 2020', '2020-03-01', '2020-09-01', 9469.41, 17787.86, 1),
(2, 'Temporada de Invierno 2020-2021', '2020-09-01', '2021-03-01', 10234.18, 19403.10, 2),
(3, 'Temporada de Verano 2021', '2021-03-01', '2021-09-01', 9555.76, 16938.07, 1),
(4, 'Temporada de Invierno 2021-2022', '2021-09-01', '2022-03-01', 10580.11, 19236.34, 2),
(5, 'Temporada de Verano 2022', '2022-03-01', '2022-09-01', 9822.85, 16109.03, 1),
(6, 'Temporada de Invierno 2022-2023', '2022-09-01', '2023-03-01', 11230.53, 18251.96, 2),
(7, 'Temporada de Verano 2023', '2023-03-01', '2023-09-01', 9241.36, 17845.81, 1),
(8, 'Temporada de Invierno 2023-2024', '2023-09-01', '2024-03-01', 11181.44, 18254.93, 2),
(9, 'Temporada de Verano 2024', '2024-03-01', '2024-09-01', 10722.71, 17154.58, 1),
(10, 'Temporada de Invierno 2024-2025', '2024-09-01', '2025-03-01', 10920.55, 18297.25, 2),
(11, 'Temporada de Verano 2025', '2025-03-01', '2025-09-01', 10972.32, 17204.15, 1),
(12, 'Temporada de Invierno 2025-2026', '2025-09-01', '2026-03-01', 11682.89, 19513.49, 2);
