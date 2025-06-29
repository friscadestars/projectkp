<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - Nama Aplikasi</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="flex min-h-screen bg-gray-100">

  <!-- Sidebar -->
  <aside class="w-64 bg-blue-900 text-white flex flex-col">
    <div class="p-6 text-xl font-bold border-b border-blue-800">
      Nama Aplikasi
    </div>
    <nav class="flex-1 p-4 space-y-3">
      <a href="/dashboard" class="block py-2 px-3 rounded bg-blue-700 font-semibold">Dashboard</a>
      <a href="/orders" class="block py-2 px-3 rounded hover:bg-blue-800">Daftar Order</a>
      <a href="/update-shipment" class="block py-2 px-3 rounded hover:bg-blue-800">Update Status Pengiriman</a>
      <a href="/history" class="block py-2 px-3 rounded hover:bg-blue-800">Riwayat Order & Tagihan</a>
      <a href="/logout" class="block py-2 px-3 rounded hover:bg-blue-800">Logout</a>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 p-8 bg-white" x-data="{ showNotif: false, showProfile: false }">
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-semibold">Selamat Datang di Dashboard Anda</h1>

      <div class="flex items-center space-x-4 relative">
        <!-- Notification Bell -->
        <button @click="showNotif = !showNotif" class="relative focus:outline-none">
          <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          🔔
        </button>

        <!-- Profile Button -->
        <div class="relative" @click.outside="showProfile = false">
          <button @click="showProfile = !showProfile" class="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white focus:outline-none">
            👤
          </button>

          <!-- Profile Dropdown -->
          <div x-show="showProfile" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 text-black">
            <a href="/profile" class="block px-4 py-2 hover:bg-gray-100">Profil</a>
            <a href="/logout" class="block px-4 py-2 hover:bg-gray-100">Logout</a>
          </div>
        </div>
      </div>
    </header>

    <!-- Notification Panel -->
    <div x-show="showNotif" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
      Anda memiliki notifikasi baru! 📩
    </div>

    <!-- Cards Section -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6 text-center border">
        <p class="text-lg font-semibold">Total Order</p>
        <p class="text-2xl font-bold mt-2">6</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6 text-center border">
        <p class="text-lg font-semibold">Diproses</p>
        <p class="text-2xl font-bold mt-2">1</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6 text-center border">
        <p class="text-lg font-semibold">Dikirim</p>
        <p class="text-2xl font-bold mt-2">1</p>
      </div>
    </div>
  </main>

</body>
</html>
