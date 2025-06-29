<h2>Daftar Tagihan</h2>
<a href="/invoices/create">Tambah Tagihan</a>
<ul>
    <?php foreach ($invoices as $invoice): ?>
        <li>
            Order ID: <?= $invoice['order_id'] ?> | Total: Rp<?= $invoice['total_amount'] ?> | Tanggal: <?= $invoice['invoice_date'] ?>
            <a href="/invoices/edit/<?= $invoice['id'] ?>">Edit</a>
            <a href="/invoices/delete/<?= $invoice['id'] ?>">Hapus</a>
        </li>
    <?php endforeach ?>
</ul>
