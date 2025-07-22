import flowbite from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite/**/*.js', // Untuk mendukung komponen Flowbite
  ],
  safelist: [
    // Kelas khusus yang digunakan dalam komponen dinamis atau melalui logika JS
    'detail-order-container',
    'detail-order-header',
    'detail-order-title',
    'detail-order-icon',
    'detail-order-error',

    // Warna tombol custom
    'bg-btn-primary',
    'bg-btn-success',
    'bg-btn-info',
    'bg-btn-confirm',
    'bg-btn-warning',
    'bg-btn-danger',
    'bg-btn-disabled',
    'bg-btn-dark',
    'bg-btn-light',

    // Warna teks umum
    'text-white',
  ],
  theme: {
    extend: {
      colors: {
        // Warna tambahan untuk status
        dikirim: '#17A2B8',

        // Warna tambahan untuk tombol custom
        'btn-primary': '#2563EB',   // biru
        'btn-success': '#16A34A',   // hijau
        'btn-info': '#0EA5E9',      // biru muda
        'btn-confirm': '#10B981',   // hijau emerald
        'btn-warning': '#F59E0B',   // oranye
        'btn-danger': '#EF4444',    // merah
        'btn-disabled': '#9CA3AF',  // abu-abu
        'btn-dark': '#122786',      // abu gelap
        'btn-light': '#F3F4F6',     // abu terang

        // Warna tema utama
        'primary-darkest': '#141414',
        'primary-dark': '#122786',
        'primary-light': '#CFE4FF',
        'secondary': '#F4F6F9',
        'secondary-light': '#EFF9FF',
      },
      maxWidth: {
        // Batas lebar tambahan
        '9xl': '96rem',
      },
    },
  },
  plugins: [
    flowbite, // Plugin Flowbite
  ],
};
