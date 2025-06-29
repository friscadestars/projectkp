<h2>Tambah Pengiriman</h2>
<form action="/shipments/store" method="post">
    <label>Order:</label>
    <select name="order_id">
        <?php foreach ($orders as $order): ?>
            <option value="<?= $order['id'] ?>">Order #<?= $order['id'] ?></option>
        <?php endforeach ?>
    </select><br>

    <label>Tanggal Pengiriman:</label>
    <input type="datetime-local" name="shipped_date" required><br>

    <label>Status:</label>
    <input type="text" name="status" placeholder="Contoh: Dikirim, Diterima"><br>

    <button type="submit">Simpan</button>
</form>
