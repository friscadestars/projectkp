<h2>Item dalam Pesanan #<?= $orderId ?></h2>
<a href="/order-items/create/<?= $orderId ?>">Tambah Item</a>
<ul>
    <?php foreach ($orderItems as $item): ?>
        <li>
            Product ID: <?= $item['product_id'] ?> | Quantity: <?= $item['quantity'] ?>
            <a href="/order-items/edit/<?= $item['id'] ?>">Edit</a>
            <a href="/order-items/delete/<?= $item['id'] ?>">Hapus</a>
        </li>
    <?php endforeach ?>
</ul>
<a href="/orders">Kembali ke Orders</a>
