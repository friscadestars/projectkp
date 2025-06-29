<h2>Tambah Pesanan</h2>
<form action="/orders/store" method="post">
    <label>User:</label>
    <select name="user_id">
        <?php foreach ($users as $user): ?>
            <option value="<?= $user['id'] ?>"><?= $user['username'] ?></option>
        <?php endforeach ?>
    </select><br>
    <label>Tanggal Pesanan:</label>
    <input type="datetime-local" name="order_date"><br>
    <button type="submit">Simpan</button>
</form>
