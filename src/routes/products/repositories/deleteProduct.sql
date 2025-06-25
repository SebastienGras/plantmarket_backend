DELETE FROM products
WHERE id = $1
RETURNING
    id,
    title,
    description,
    price,
    category_id,
    subcategory_id,
    created_at,
    seller_id,
    actif;