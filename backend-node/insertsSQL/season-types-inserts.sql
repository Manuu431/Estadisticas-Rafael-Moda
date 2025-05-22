
DROP TABLE IF EXISTS season_types;
CREATE TABLE season_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  start_day INT,
  start_month INT,
  end_day INT,
  end_month INT
);

INSERT INTO season_types (id, name, start_day, start_month, end_day, end_month) VALUES
(1, 'Temporada de Verano', 1, 3, 1, 9),
(2, 'Temporada de Invierno', 1, 9, 1, 3);
