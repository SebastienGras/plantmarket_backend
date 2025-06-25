CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_checked_out BOOLEAN DEFAULT FALSE
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  UNIQUE(cart_id, product_id)
);

CREATE OR REPLACE VIEW user_cart_total AS
SELECT
  u.id AS user_id,
  c.id AS cart_id,
  SUM(ci.quantity * p.price) AS total_price
FROM users u
JOIN carts c ON c.user_id = u.id AND c.is_checked_out = FALSE
JOIN cart_items ci ON ci.cart_id = c.id
JOIN products p ON p.id = ci.product_id
GROUP BY u.id, c.id;
