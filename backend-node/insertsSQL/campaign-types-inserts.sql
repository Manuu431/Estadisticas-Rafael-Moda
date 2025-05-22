
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
(1, 'Campaña Día de San Valentín', 1, 2, 14, 2, 2020),
(2, 'Campaña Navidad', 15, 12, 6, 1, 2020),
(3, 'Campaña Black Friday', 20, 11, 30, 11, 2020);