UPDATE cart_items
SET quantity = $3
WHERE product_id = $2
  AND cart_id = $1
  AND $3 > 0
  RETURNING *;