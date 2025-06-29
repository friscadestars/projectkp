<h2>Edit Tagihan</h2>
<form action="/invoices/update/<?= $invoice['id'] ?>" method="post">
    <label>Order:</label>
    <select name="order_id">
        <?php foreach ($orders as $order): ?>
            <option value="<?= $order['id'] ?>" <?= $order['id'] == $invoice['order_id'] ? 'selected' : '' ?>>
                Order #<?= $order['id'] ?> (User ID: <?= $order['user_id'] ?>)
            </option>
        <?php endforeach ?>
    </select><br>
    <label>Total:</label>
    <input type="number" step="0.01" name="total_amount" value="<?= $invoice['total_amount'] ?>"><br>
    <label>Tanggal:</label>
    <input type="datetime-local" name="invoice_date" value="<?= date('Y-m-d\TH:i', strtotime($invoice['invoice_date'])) ?>"><br>
    <button type="submit">Update</button>
</form>
