import React from "react";
import { Link } from "react-router-dom";
import iconOrderMasuk from "../../../assets/icons/ordermasuk.png";
import iconValidasi from "../../../assets/icons/validasi.png";
import iconMonitoring from "../../../assets/icons/monitoring.png";

export default function ContentPabrik() {
  return (
    <section className="py-16 px-6 md:px-20">
      {/* Judul & Subteks */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-2xl font-bold text-primary-dark mb-8">
          Ingin Mengelola Produksi dan Pengiriman?
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 inline-block">
          <p className="text-primary-darkest text-base mb-3">
            Akses seluruh proses penting seperti order masuk dari distributor, status produksi & pengiriman, 
            monitoring aktivitas distributor, dan pengelolaan daftar harga di menu <b>Dashboard</b>
          </p>
          <Link
            to="/pabrik/dashboard-pabrik"
            className="inline-block bg-primary-dark hover:bg-blue-800 text-white font-medium text-sm px-5 py-2 rounded-lg transition duration-200"
          >
            Ke Dashboard
          </Link>
        </div>
      </div>

      {/* 3 Card Fitur */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {/* Permintaan Order */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-all duration-300 p-6">
            <div className="bg-secondary-light w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <img src={iconOrderMasuk} alt="Icon Order Masuk" className="w-6 h-6" />
            </div>
          <h3 className="font-bold text-primary-dark mb-2">Daftar Order Masuk</h3>
          <p className="text-primary-darkest text-[15px]">
            Lihat semua permintaan order yang dikirimkan oleh distributor. Kelola dan jadwalkan produksi sesuai kapasitas pabrik.
          </p>
        </div>

        {/* Riwayat Order */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-all duration-300 p-6">
            <div className="bg-secondary-light w-12 h-9 rounded-lg flex items-center justify-center mb-4">
                <img src={iconValidasi } alt="Icon Produksi" className="w-6 h-5" />
            </div>
          <h3 className="font-bold text-primary-dark mb-2">Produksi & Pengiriman</h3>
          <p className="text-primary-darkest text-[15px]">
            Atur proses produksi dan pantau status pengiriman barang secara real-time, agar distribusi berjalan tepat waktu
          </p>
        </div>

        {/* Tagihan */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-all duration-300 p-6">
            <div className="bg-secondary-light w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <img src={iconMonitoring} alt="Icon Monitoring" className="w-6 h-5" />
            </div>
          <h3 className="font-bold text-primary-dark mb-2">Monitoring Distributor</h3>
          <p className="text-primary-darkest text-[15px]">
            Pantau aktivitas distributor terkait permintaan, status pengiriman, dan efisiensi alur distribusi dari satu tempat.
          </p>
        </div>
      </div>
    </section>
  );
}
