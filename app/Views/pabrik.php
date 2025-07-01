<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
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
    <nav class="flex-1 px-4 py-4 space-y-2">
      <a href="/dashboard" class="flex items-center space-x-2 bg-blue-800 p-2 rounded">
        <span>📊</span><span>Dashboard</span>
      </a>
      <a href="/orders" class="flex items-center space-x-2 hover:bg-blue-800 p-2 rounded">
        <span>📥</span><span>Daftar Order Masuk</span>
      </a>
      <a href="/produksi" class="flex items-center space-x-2 hover:bg-blue-800 p-2 rounded">
        <span>🏭</span><span>Produksi & Pengiriman</span>
      </a>
      <a href="/monitoring" class="flex items-center space-x-2 hover:bg-blue-800 p-2 rounded">
        <span>📡</span><span>Monitoring Distributor</span>
      </a>
      <a href="/harga" class="flex items-center space-x-2 hover:bg-blue-800 p-2 rounded">
        <span>💰</span><span>Daftar Harga</span>
      </a>
      <a href="/riwayat" class="flex items-center space-x-2 hover:bg-blue-800 p-2 rounded">
        <span>🕓</span><span>Riwayat Pengiriman</span>
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
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-900">Selamat Datang Di Dashboard Anda</h1>
      <div class="flex space-x-4">
        <button class="text-xl">🔔</button>
        <button class="text-xl">👤</button>
      </div>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded shadow text-center">
        <p class="text-gray-600">Order Masuk</p>
        <p class="text-3xl font-bold">10</p>
      </div>
      <div class="bg-white p-4 rounded shadow text-center">
        <p class="text-gray-600">Sedang Diproduksi</p>
        <p class="text-3xl font-bold">5</p>
      </div>
      <div class="bg-white p-4 rounded shadow text-center border-t-4 border-blue-900">
        <p class="text-gray-600">Dikirim</p>
        <p class="text-3xl font-bold">5</p>
      </div>
      <div class="bg-white p-4 rounded shadow text-center">
        <p class="text-gray-600">Order Selesai</p>
        <p class="text-3xl font-bold">5</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-semibold text-blue-900 mb-4">Daftar Pengiriman Aktif</h2>
      <table class="w-full text-sm table-auto border-collapse">
        <thead class="bg-blue-900 text-white">
          <tr>
            <th class="px-4 py-2">No</th>
            <th class="px-4 py-2">Order ID</th>
            <th class="px-4 py-2">Agen ID</th>
            <th class="px-4 py-2">Distributor ID</th>
            <th class="px-4 py-2">Tanggal Kirim</th>
            <th class="px-4 py-2">Jumlah Produk</th>
            <th class="px-4 py-2">No. Resi</th>
            <th class="px-4 py-2">Status Order</th>
          </tr>
        </thead>
        <tbody class="text-center text-gray-700">
          <tr class="border-t">
            <td class="px-4 py-2">1</td>
            <td class="px-4 py-2">ORD-002</td>
            <td class="px-4 py-2">AG-001</td>
            <td class="px-4 py-2">DS-002</td>
            <td class="px-4 py-2">24/06/2025</td>
            <td class="px-4 py-2">3</td>
            <td class="px-4 py-2">SHP12345679</td>
            <td class="px-4 py-2"><span class="bg-cyan-500 text-white text-xs px-3 py-1 rounded-full">Dikirim</span></td>
          </tr>
          <tr class="border-t">
            <td class="px-4 py-2">2</td>
            <td class="px-4 py-2">ORD-001</td>
            <td class="px-4 py-2">AG-001</td>
            <td class="px-4 py-2">DS-002</td>
            <td class="px-4 py-2">24/06/2025</td>
            <td class="px-4 py-2">3</td>
            <td class="px-4 py-2">SHP12345678</td>
            <td class="px-4 py-2"><span class="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full">Diterima</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</div>

</body>
</html>
