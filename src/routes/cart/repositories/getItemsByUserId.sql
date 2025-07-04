SELECT 
    ci.product_id, 
    ci.quantity,
    ci.cart_id, 
    p.title, 
    p.description, 
    p.price,
    p.stock,
    cat.name as category_name,
    sub.name as subcategory_name
FROM cart_items ci
JOIN carts c ON ci.cart_id = c.id
JOIN products p on ci.product_id = p.id
JOIN categories cat on p.category_id = cat.id
JOIN subcategories sub on p.subcategory_id = sub.id
WHERE c.user_id = $1;