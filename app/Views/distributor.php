<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dashboard - Nama Aplikasi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans">

<div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-blue-900 text-white flex flex-col">
        <div class="text-2xl font-bold px-6 py-4 border-b border-blue-700">
            Nama Aplikasi
        </div>
        <nav class="flex-1 px-4 py-2 space-y-2">
            <a href="#" class="flex items-center space-x-2 p-2 bg-blue-800 rounded">
                <span>📊</span><span>Dashboard</span>
            </a>
            <a href="#" class="flex items-center space-x-2 p-2 hover:bg-blue-800 rounded">
                <span>🧭</span><span>Monitoring</span>
            </a>
            <a href="#" class="flex items-center space-x-2 p-2 hover:bg-blue-800 rounded">
                <span>📝</span><span>Validasi Order</span>
            </a>
            <a href="#" class="flex items-center space-x-2 p-2 hover:bg-blue-800 rounded">
                <span>📦</span><span>Daftar Harga</span>
            </a>
            <a href="#" class="flex items-center space-x-2 p-2 hover:bg-blue-800 rounded">
                <span>📁</span><span>Riwayat Order</span>
            </a>
            <a href="#" class="flex items-center space-x-2 p-2 hover:bg-blue-800 rounded">
                <span>💳</span><span>Tagihan</span>
            </a>
        </nav>
        <div class="px-4 py-4 border-t border-blue-700">
      <a href="/logout" class="flex items-center space-x-2 text-red-400 hover:text-red-700">
        <span>⏻</span><span>Logout</span>
      </a>
    </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6">
        <!-- Welcome -->
        <h1 class="text-2xl font-bold text-blue-900 mb-6">Selamat Datang Di Dashboard Anda</h1>

        <!-- Cards -->
        <div class="grid grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-6 rounded shadow text-center">
                <div class="text-gray-600">Order Masuk</div>
                <div class="text-3xl font-bold">10</div>
            </div>
            <div class="bg-white p-6 rounded shadow text-center border-t-4 border-blue-900">
                <div class="text-gray-600">Pengiriman</div>
                <div class="text-3xl font-bold">5</div>
            </div>
            <div class="bg-white p-6 rounded shadow text-center">
                <div class="text-gray-600">Order Selesai</div>
                <div class="text-3xl font-bold">5</div>
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded shadow p-4">
            <h2 class="text-xl font-semibold text-blue-900 mb-4">Status Pengiriman Terbaru</h2>
            <table class="w-full text-sm table-auto">
                <thead class="bg-blue-900 text-white">
                    <tr>
                        <th class="px-4 py-2">No</th>
                        <th class="px-4 py-2">Order ID</th>
                        <th class="px-4 py-2">Agen ID</th>
                        <th class="px-4 py-2">Distributor ID</th>
                        <th class="px-4 py-2">Tanggal Kirim</th>
                        <th class="px-4 py-2">Estimasi Sampai</th>
                        <th class="px-4 py-2">Jumlah Produk</th>
                        <th class="px-4 py-2">No. Resi</th>
                        <th class="px-4 py-2">Status Order</th>
                    </tr>
                </thead>
                <tbody class="text-center">
                    <tr class="border-t">
                        <td class="px-4 py-2">1</td>
                        <td class="px-4 py-2">ORD-001</td>
                        <td class="px-4 py-2">AG-001</td>
                        <td class="px-4 py-2">DS-002</td>
                        <td class="px-4 py-2">24/06/2025</td>
                        <td class="px-4 py-2">27/06/2025</td>
                        <td class="px-4 py-2">3</td>
                        <td class="px-4 py-2">SHP12345679</td>
                        <td class="px-4 py-2"><span class="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs">Dikirim</span></td>
                    </tr>
                    <tr class="border-t">
                        <td class="px-4 py-2">2</td>
                        <td class="px-4 py-2">ORD-001</td>
                        <td class="px-4 py-2">AG-001</td>
                        <td class="px-4 py-2">DS-002</td>
                        <td class="px-4 py-2">24/06/2025</td>
                        <td class="px-4 py-2">27/06/2025</td>
                        <td class="px-4 py-2">3</td>
                        <td class="px-4 py-2">SHP12345679</td>
                        <td class="px-4 py-2"><span class="bg-green-500 text-white px-3 py-1 rounded-full text-xs">Diterima</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</div>

</body>
</html>
