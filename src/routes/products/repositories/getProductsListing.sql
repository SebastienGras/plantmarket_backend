SELECT
  p.*,
  c.name AS category_name,
  sc.name AS subcategory_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
WHERE p.actif = $1::boolean
  AND ($2::uuid IS NULL OR p.category_id = $2)
  AND ($3::uuid IS NULL OR p.subcategory_id = $3)
  AND ($4::numeric IS NULL OR p.price >= $4)
  AND ($5::numeric IS NULL OR p.price <= $5)
  AND (
    $6::text IS NULL
    OR p.title ILIKE '%' || $6 || '%'
    OR p.description ILIKE '%' || $6 || '%'
  )
  AND ($7::uuid IS NULL OR p.seller_id != $7);
-- ORDER BY
--   CASE
--     WHEN $6 = 'price' AND $7 = 'asc' THEN p.price
--     WHEN $6 = 'price' AND $7 = 'desc' THEN p.price
--     WHEN $6 = 'created_at' AND $7 = 'asc' THEN p.created_at
--     WHEN $6 = 'created_at' AND $7 = 'desc' THEN p.created_at
--     ELSE p.created_at
--   END
--   ASC;
