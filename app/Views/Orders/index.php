<h2>Daftar Pesanan</h2>
<a href="/orders/create">Tambah Pesanan</a>
<ul>
    <?php foreach ($orders as $order): ?>
        <li>
            Order ID: <?= $order['id'] ?> | User ID: <?= $order['user_id'] ?> | Tanggal: <?= $order['order_date'] ?>
            <a href="/orders/edit/<?= $order['id'] ?>">Edit</a>
            <a href="/orders/delete/<?= $order['id'] ?>">Hapus</a>
        </li>
    <?php endforeach ?>
</ul>
