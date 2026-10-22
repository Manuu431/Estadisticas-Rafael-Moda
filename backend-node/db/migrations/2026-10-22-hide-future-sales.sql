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
JOIN families f ON f.id = p.family_id
WHERE t.sold_at <= NOW();