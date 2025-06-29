<h2>Edit Pengiriman</h2>
<form action="/shipments/update/<?= $shipment['id'] ?>" method="post">
    <label>Order:</label>
    <select name="order_id">
        <?php foreach ($orders as $order): ?>
            <option value="<?= $order['id'] ?>" <?= $order['id'] == $shipment['order_id'] ? 'selected' : '' ?>>
                Order #<?= $order['id'] ?>
            </option>
        <?php endforeach ?>
    </select><br>

    <label>Tanggal Pengiriman:</label>
    <input type="datetime-local" name="shipped_date" value="<?= date('Y-m-d\TH:i', strtotime($shipment['shipped_date'])) ?>"><br>

    <label>Status:</label>
    <input type="text" name="status" value="<?= $shipment['status'] ?>"><br>

    <button type="submit">Update</button>
</form>
