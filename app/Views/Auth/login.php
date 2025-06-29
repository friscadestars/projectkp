<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login - Nama Aplikasi</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-white flex flex-col justify-between">

  <!-- Header -->
  <header class="p-6">
    <h1 class="text-blue-800 font-semibold text-lg">Nama Aplikasi</h1>
  </header>

  <!-- Main Content -->
  <main class="flex-grow flex flex-col items-center justify-center px-4">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Selamat Datang!</h2>
      <p class="text-sm text-gray-600">Silahkan Login untuk kelola permintaan dan pantau status orderan Anda</p>
    </div>

    <div class="w-full max-w-md bg-blue-900 p-8 rounded-2xl shadow-md">
      <form action="/login" method="POST" class="space-y-4">
        <div>
          <label for="email" class="block text-white mb-1">Email</label>
          <input type="email" name="email" id="email" required class="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>

        <div>
          <label for="password" class="block text-white mb-1">Password</label>
          <input type="password" name="password" id="password" required class="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>

        <!-- Tambahan Role -->
        <div>
  <label for="role" class="block text-white text-sm mb-1">Login Sebagai</label>
  <select name="role" id="role" required class="w-full px-2 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300">
    <option value="">-- Pilih Role --</option>
    <option value="agen">Agen</option>
    <option value="distributor">Distributor</option>
    <option value="pabrik">Pabrik</option>
  </select>
</div>


        <div>
          <button type="submit" class="w-full bg-white text-blue-900 font-medium py-2 rounded-md hover:bg-gray-100">Log In</button>
        </div>
      </form>

      <!-- Menu bantuan -->
      <div class="text-center text-sm text-white mt-4">
        Butuh Bantuan? <a href="#" class="font-semibold underline">Hubungi Kami</a>
      </div>

      <!-- Menu register -->
      <div class="text-center text-sm text-white mt-2">
        Belum punya akun? <a href="/register" class="font-semibold underline">Daftar Sekarang</a>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-blue-900 text-white text-center py-6">
    <div class="text-lg font-semibold mb-1">Nama Aplikasi</div>
    <div class="text-sm">Deskripsi singkat aplikasi</div>
    <div class="text-xs mt-2">&copy;2025 PT Imersa Solusi Teknologi. All rights reserved</div>
  </footer>
</body>
</html>
