SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS `v_sales`;
DROP TABLE IF EXISTS `sale_lines`;
DROP TABLE IF EXISTS `tickets`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `families`;
DROP TABLE IF EXISTS `brands`;
DROP TABLE IF EXISTS `periods`;
DROP TABLE IF EXISTS `period_types`;
DROP TABLE IF EXISTS `clients`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `sales`;
DROP TABLE IF EXISTS `campaigns`;
DROP TABLE IF EXISTS `campaign_types`;
DROP TABLE IF EXISTS `seasons`;
DROP TABLE IF EXISTS `season_types`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `city` varchar(80) DEFAULT NULL,
  `province` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_clients_name` (`name`),
  KEY `idx_clients_city` (`city`),
  KEY `idx_clients_province` (`province`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `brands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_brands_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `families` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `category` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_families_name` (`name`),
  KEY `idx_families_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `brand_id` int NOT NULL,
  `family_id` int NOT NULL,
  `section` enum('mujer','hombre') NOT NULL,
  `color` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_products_name` (`name`),
  KEY `idx_products_section` (`section`),
  KEY `idx_products_color` (`color`),
  CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  CONSTRAINT `fk_products_family` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sold_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tickets_sold_at` (`sold_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sale_lines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int NOT NULL,
  `product_id` int NOT NULL,
  `size` varchar(10) NOT NULL,
  `units` int NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `unit_cost` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_sale_lines_size` (`size`),
  CONSTRAINT `fk_sale_lines_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sale_lines_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `chk_sale_lines_units` CHECK (`units` > 0),
  CONSTRAINT `chk_sale_lines_price` CHECK (`unit_price` >= 0 AND `unit_cost` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `period_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kind` enum('campaign','season') NOT NULL,
  `name` varchar(100) NOT NULL,
  `start_day` tinyint unsigned NOT NULL,
  `start_month` tinyint unsigned NOT NULL,
  `end_day` tinyint unsigned NOT NULL,
  `end_month` tinyint unsigned NOT NULL,
  `first_year` smallint unsigned NOT NULL,
  `repeats` tinyint(1) NOT NULL DEFAULT 1,
  `last_year` smallint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_period_types_kind_name` (`kind`,`name`),
  CONSTRAINT `chk_period_types_last_year` CHECK (`last_year` IS NULL OR `last_year` >= `first_year`),
  CONSTRAINT `chk_period_types_days` CHECK (`start_day` BETWEEN 1 AND 31 AND `end_day` BETWEEN 1 AND 31),
  CONSTRAINT `chk_period_types_months` CHECK (`start_month` BETWEEN 1 AND 12 AND `end_month` BETWEEN 1 AND 12)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `periods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `period_type_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `expenses` decimal(10,2) NOT NULL DEFAULT 0.00,
  `skipped` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_periods_type_start` (`period_type_id`,`start_date`),
  KEY `idx_periods_start_date` (`start_date`),
  KEY `idx_periods_end_date` (`end_date`),
  CONSTRAINT `fk_periods_type` FOREIGN KEY (`period_type_id`) REFERENCES `period_types` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_periods_dates` CHECK (`end_date` >= `start_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW `v_sales` AS
SELECT
  l.id,
  t.id AS ticket_id,
  t.sold_at,
  DATE(t.sold_at) AS sale_date,
  p.id AS product_id,
  p.name AS product,
  p.color,
  p.section,
  b.name AS brand,
  f.name AS family,
  f.category AS family_category,
  l.size,
  l.units,
  l.unit_price,
  l.unit_cost,
  ROUND(l.unit_price * l.units, 2) AS amount,
  ROUND(l.unit_cost * l.units, 2) AS cost,
  ROUND((l.unit_price - l.unit_cost) * l.units, 2) AS profit
FROM sale_lines l
JOIN tickets t ON t.id = l.ticket_id
JOIN products p ON p.id = l.product_id
JOIN brands b ON b.id = p.brand_id
JOIN families f ON f.id = p.family_id;