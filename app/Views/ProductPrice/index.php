<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title><?= $title ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen p-8">

    <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4"><?= esc($title) ?></h2>

        <!-- Form Tambah Produk -->
        <form action="<?= base_url('daftar-harga/tambah') ?>" method="post" class="flex flex-wrap items-center gap-2 mb-6">
            <input type="hidden" name="role" value="<?= esc($role) ?>">
            <input type="text" name="nama_produk" placeholder="Nama Produk" class="border p-2 rounded w-48" required>
            <input type="text" name="kode_produk" placeholder="Kode Produk" class="border p-2 rounded w-40" required>
            <input type="number" name="harga" placeholder="Harga <?= ucfirst($role) ?>" class="border p-2 rounded w-40" required>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah</button>
        </form>

        <!-- Search -->
        <input type="text" id="searchInput" placeholder="Cari..." class="border p-2 rounded mb-3 w-1/3">

        <!-- Tabel Produk -->
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-300">
                <thead class="bg-blue-900 text-white">
                    <tr>
                        <th class="px-4 py-2 border">No</th>
                        <th class="px-4 py-2 border">Nama Produk</th>
                        <th class="px-4 py-2 border">Kode Produk</th>
                        <th class="px-4 py-2 border">Harga <?= ucfirst($role) ?></th>
                        <th class="px-4 py-2 border">Aksi</th>
                    </tr>
                </thead>
                <tbody id="produkTable">
                    <?php foreach ($produk as $index => $item): ?>
                        <tr class="border text-center">
                            <td class="border px-2 py-1"><?= $index + 1 ?></td>
                            <td class="border px-2 py-1"><?= esc($item['nama_produk']) ?></td>
                            <td class="border px-2 py-1"><?= esc($item['kode_produk']) ?></td>
                            <td class="border px-2 py-1">Rp <?= number_format($item['harga'], 0, ',', '.') ?></td>
                            <td class="border px-2 py-1 space-x-1">
                                <form action="<?= base_url('daftar-harga/update/' . $item['id']) ?>" method="post" class="inline-block">
                                    <input type="text" name="nama_produk" value="<?= esc($item['nama_produk']) ?>" class="border p-1 rounded w-28">
                                    <input type="text" name="kode_produk" value="<?= esc($item['kode_produk']) ?>" class="border p-1 rounded w-20">
                                    <input type="number" name="harga" value="<?= esc($item['harga']) ?>" class="border p-1 rounded w-20">
                                    <button type="submit" class="bg-green-600 text-white px-2 py-1 rounded text-sm">Simpan</button>
                                </form>
                                <a href="<?= base_url('daftar-harga/hapus/' . $item['id']) ?>" onclick="return confirm('Hapus produk ini?')" class="bg-red-600 text-white px-2 py-1 rounded text-sm">Hapus</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if (empty($produk)): ?>
                        <tr>
                            <td colspan="5" class="text-center py-4">Belum ada data.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        // Filter pencarian manual
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('keyup', function () {
            const filter = searchInput.value.toLowerCase();
            const rows = document.querySelectorAll('#produkTable tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    </script>

</body>
</html>
