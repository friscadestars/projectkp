<h2>Edit Item</h2>
<form action="/order-items/update/<?= $item['id'] ?>" method="post">
    <label>Produk:</label>
    <select name="product_id">
        <?php foreach ($products as $product): ?>
            <option value="<?= $product['id'] ?>" <?= $product['id'] == $item['product_id'] ? 'selected' : '' ?>>
                <?= $product['name'] ?>
            </option>
        <?php endforeach ?>
    </select><br>
    <label>Jumlah:</label>
    <input type="number" name="quantity" value="<?= $item['quantity'] ?>"><br>
    <button type="submit">Update</button>
</form>
