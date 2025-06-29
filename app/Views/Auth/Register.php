<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <style>
        body {
            font-family: sans-serif;
            text-align: center;
            background-color: #f8f9fa;
        }
        .container {
            margin-top: 50px;
            display: inline-block;
            padding: 30px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 0 10px #ccc;
        }
        input {
            width: 250px;
            padding: 10px;
            margin: 10px 0;
            border-radius: 6px;
            border: 1px solid #ccc;
        }
        button {
            width: 270px;
            padding: 10px;
            background-color: navy;
            color: white;
            border: none;
            border-radius: 6px;
        }
        a { text-decoration: none; color: navy; }
    </style>
</head>
<body>

    <div class="container">
        <h2>Register</h2>

        <?php if (session()->getFlashdata('error')): ?>
            <p style="color: red;"><?= session()->getFlashdata('error') ?></p>
        <?php endif; ?>

        <form method="post" action="<?= base_url('/register') ?>">
            <input type="text" name="name" placeholder="Nama Lengkap" required><br>
            <input type="email" name="email" placeholder="Email" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            
            <select name="role" required>
                <option value="">Pilih Peran</option>
                <option value="agen">Agen</option>
                <option value="distributor">Distributor</option>
                <option value="pabrik">Pabrik</option>
            </select><br>
            <button type="submit">Register</button>
        </form>

        <p>Sudah punya akun? <a href="<?= base_url('login') ?>">Login</a></p>
    </div>

</body>
</html>
