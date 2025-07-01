WITH user_cart AS (
  SELECT id AS cart_id
  FROM carts
  WHERE user_id = $1 AND is_checked_out = FALSE
  LIMIT 1
),
new_cart AS (
  INSERT INTO carts (user_id)
  SELECT $1
  WHERE NOT EXISTS (SELECT 1 FROM user_cart)
  RETURNING id AS cart_id
),
final_cart AS (
  SELECT cart_id FROM user_cart
  UNION ALL
  SELECT cart_id FROM new_cart
  LIMIT 1
),
upsert_item AS (
  INSERT INTO cart_items (cart_id, product_id, quantity)
  SELECT cart_id, $2, $3
  FROM final_cart
  ON CONFLICT (cart_id, product_id)
  DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
  RETURNING *
)
SELECT
  upsert_item.*,
  p.title,
  p.price,
  p.stock
FROM upsert_item
JOIN products p ON p.id = upsert_item.product_id;
