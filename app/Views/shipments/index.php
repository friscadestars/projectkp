<h2>Data Pengiriman</h2>
<a href="/shipments/create">Tambah Pengiriman</a>
<ul>
    <?php foreach ($shipments as $shipment): ?>
        <li>
            Order #<?= $shipment['order_id'] ?> | Tanggal Kirim: <?= $shipment['shipped_date'] ?> | Status: <?= $shipment['status'] ?>
            <a href="/shipments/edit/<?= $shipment['id'] ?>">Edit</a>
            <a href="/shipments/delete/<?= $shipment['id'] ?>">Hapus</a>
        </li>
    <?php endforeach ?>
</ul>
