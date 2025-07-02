UPDATE cart_items
SET quantity = $3
WHERE product_id = $2
  AND cart_id = (
    SELECT id
    FROM carts
    WHERE user_id = $1
    LIMIT 1
  )
  AND $3 > 0
  RETURNING *;