<h2>Tambah Tagihan</h2>
<form action="/invoices/store" method="post">
    <label>Order:</label>
    <select name="order_id">
        <?php foreach ($orders as $order): ?>
            <option value="<?= $order['id'] ?>">Order #<?= $order['id'] ?> (User ID: <?= $order['user_id'] ?>)</option>
        <?php endforeach ?>
    </select><br>
    <label>Total:</label>
    <input type="number" step="0.01" name="total_amount" required><br>
    <label>Tanggal Tagihan:</label>
    <input type="datetime-local" name="invoice_date" required><br>
    <button type="submit">Simpan</button>
</form>
