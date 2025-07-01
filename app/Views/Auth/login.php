<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Login - OrderLink</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center">

  <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center text-blue-900 mb-4">Login ke OrderLink</h2>

    <!-- Notifikasi error -->
    <?php if (session()->getFlashdata('error')): ?>
      <div class="bg-red-100 text-red-700 p-3 mb-4 rounded">
        <?= session()->getFlashdata('error') ?>
      </div>
    <?php endif; ?>

    <form action="<?= base_url('/login') ?>" method="post" class="space-y-4">
      <?= csrf_field() ?>
      
      <!-- Email -->
      <div>
        <label for="email" class="block mb-1 text-sm text-gray-700">Email</label>
        <input type="email" name="email" id="email" required
               class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block mb-1 text-sm text-gray-700">Password</label>
        <input type="password" name="password" id="password" required
               class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
      </div>

      <!-- Role -->
      <div>
        <label for="role" class="block mb-1 text-sm text-gray-700">Role</label>
        <select name="role" id="role" required
                class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="">-- Pilih Role --</option>
          <option value="agen">Agen</option>
          <option value="pabrik">Pabrik</option>
          <option value="distributor">Distributor</option>
        </select>
      </div>

      <!-- Submit -->
      <button type="submit"
              class="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition">
        Login
      </button>
    </form>

    <!-- Register -->
    <p class="mt-4 text-center text-sm text-gray-600">
      Belum punya akun? <a href="/register" class="text-blue-700 font-semibold hover:underline">Daftar di sini</a>
    </p>
  </div>

</body>
</html>
