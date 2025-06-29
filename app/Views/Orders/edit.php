<h2>Edit Pesanan</h2>
<form action="/orders/update/<?= $order['id'] ?>" method="post">
    <label>User:</label>
    <select name="user_id">
        <?php foreach ($users as $user): ?>
            <option value="<?= $user['id'] ?>" <?= $user['id'] == $order['user_id'] ? 'selected' : '' ?>>
                <?= $user['username'] ?>
            </option>
        <?php endforeach ?>
    </select><br>
    <label>Tanggal Pesanan:</label>
    <input type="datetime-local" name="order_date" value="<?= date('Y-m-d\TH:i', strtotime($order['order_date'])) ?>"><br>
    <button type="submit">Update</button>
</form>
