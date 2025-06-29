<h2>Edit Produk</h2>
<form action="/products/update/<?= $product['id'] ?>" method="post">
    <input type="text" name="name" value="<?= $product['name'] ?>"><br>
    <input type="number" name="price" value="<?= $product['price'] ?>"><br>
    <input type="number" name="stock" value="<?= $product['stock'] ?>"><br>
    <button type="submit">Update</button>
</form>
