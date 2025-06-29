<h2>Daftar Produk</h2>
<a href="/products/create">Tambah Produk</a>
<ul>
    <?php foreach ($products as $product): ?>
        <li>
            <?= $product['name'] ?> | Rp<?= $product['price'] ?> |
            <a href="/products/edit/<?= $product['id'] ?>">Edit</a> |
            <a href="/products/delete/<?= $product['id'] ?>">Hapus</a>
        </li>
    <?php endforeach ?>
</ul>
