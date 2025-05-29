
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
(1, 'Reyes', 26, 12, 5, 1, 2020),
(2, 'Rebajas de enero', 7, 1, 28, 2, 2020),
(3, 'Día de los enamorados', 1, 2, 14, 2, 2020),
(4, 'Día del padre', 1, 3, 18, 3, 2020),
(5, 'Comuniones', 1, 3, 15, 5, 2020),
(6, 'Día de la madre', 20, 4, 3, 5, 2020),
(7, 'Feria de junio', 5, 6, 13, 6, 2020),
(8, 'Rebajas de julio', 1, 7, 31, 7, 2020),
(9, 'Rebajas de agosto', 1, 8, 31, 8, 2020),
(10, 'Mocadorà de octubre', 1, 10, 8, 10, 2020),
(11, 'Navidad', 1, 12, 24, 12, 2020);