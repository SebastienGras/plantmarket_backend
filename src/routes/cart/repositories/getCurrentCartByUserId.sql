SELECT
    id
FROM
    carts
WHERE
    user_id = $1
    AND is_checked_out = FALSE;