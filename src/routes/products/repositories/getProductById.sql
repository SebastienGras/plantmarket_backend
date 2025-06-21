SELECT 
  products.*,
  categories.name AS category_name,
  subcategories.name AS subcategory_name
FROM products
LEFT JOIN categories ON products.category_id = categories.id
LEFT JOIN subcategories ON products.subcategory_id = subcategories.id
WHERE products.id = $1;