SELECT
  user_id,
  cart_id,
  item_count,
  total_price
FROM user_cart_total
WHERE user_id = $1;