ALTER TABLE `period_types`
  ADD COLUMN `last_year` smallint unsigned DEFAULT NULL AFTER `repeats`,
  ADD CONSTRAINT `chk_period_types_last_year` CHECK (`last_year` IS NULL OR `last_year` >= `first_year`);

ALTER TABLE `periods`
  ADD COLUMN `skipped` tinyint(1) NOT NULL DEFAULT 0 AFTER `expenses`;
