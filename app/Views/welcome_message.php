<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Beranda - Nama Aplikasi</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
</head>
<body class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">

  <!-- Header -->
  <header class="fixed top-0 left-0 w-full bg-blue-900 bg-opacity-60 backdrop-blur-md shadow-md z-50 p-4 flex justify-between items-center">
    <h1 class="text-xl font-bold">Nama Aplikasi</h1>
    <a href="<?= site_url('login') ?>" class="bg-white text-blue-900 font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition">Login</a>
  </header>

  <!-- Hero Section -->
  <section class="min-h-screen flex items-center justify-center text-center px-4 mt-20">
    <div data-aos="fade-up" data-aos-duration="1000">
      <h2 class="text-5xl md:text-6xl font-extrabold mb-4">Selamat Datang</h2>
      <p class="text-lg md:text-xl mb-6">Kelola data Anda dengan sistem yang efisien dan aman</p>
      <a href="#informasi" class="bg-white text-purple-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300">
        Jelajahi Lebih Lanjut
      </a>
    </div>
  </section>

  <!-- Informasi Section -->
  <section id="informasi" class="bg-white text-gray-800 py-20 px-6 md:px-20">
    <div class="max-w-4xl mx-auto">
      <h3 class="text-3xl font-bold text-center mb-10" data-aos="fade-up">Tentang Aplikasi</h3>
      <div class="grid md:grid-cols-2 gap-10">
        <div data-aos="fade-right" class="space-y-4">
          <h4 class="text-xl font-semibold">🔐 Keamanan Data</h4>
          <p>Kami menjaga data Anda dengan teknologi enkripsi terbaru untuk memastikan keamanan maksimal.</p>
        </div>
        <div data-aos="fade-left" class="space-y-4">
          <h4 class="text-xl font-semibold">⚡ Performa Cepat</h4>
          <p>Dengan arsitektur modern, aplikasi ini berjalan cepat bahkan untuk data yang besar.</p>
        </div>
        <div data-aos="fade-right" class="space-y-4">
          <h4 class="text-xl font-semibold">💼 Fitur Lengkap</h4>
          <p>Kelola pengguna, pesanan, invoice, dan pengiriman dari satu tempat.</p>
        </div>
        <div data-aos="fade-left" class="space-y-4">
          <h4 class="text-xl font-semibold">📱 Responsif</h4>
          <p>Desain adaptif yang nyaman digunakan di semua perangkat, dari desktop hingga smartphone.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-blue-900 text-white text-center py-6">
    &copy; <?= date('Y') ?> Nama Aplikasi. Semua hak dilindungi.
  </footer>

  <script>
    AOS.init();
  </script>
</body>
</html>
