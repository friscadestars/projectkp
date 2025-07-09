import React from "react";
import { Link } from "react-router-dom";
import {FaMoneyBillWave } from "react-icons/fa";
import iconValidasi from "../../../assets/icons/validasi.png";
import iconMonitoring from "../../../assets/icons/monitoring.png";

export default function ContentDistributor() {
  return (
    <section className="py-16 px-6 md:px-20">
      {/* Judul & Subteks */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-2xl font-bold text-primary-dark mb-8">
          Ingin memantau seluruh aktivitas distribusi?
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 inline-block">
          <p className="text-primary-darkest text-base mb-3">
            Akses fitur lengkap seperti monitoring order & agen, validasi permintaan, pengelolaan harga,
             serta riwayat dan tagihan order di menu  <b>Dashboard</b>
          </p>
          <Link
            to="/dashboard"
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
                <img src={iconMonitoring} alt="Icon Order Masuk" className="w-6 h-5" />
            </div>
          <h3 className="font-bold text-primary-dark mb-2">Monitoring</h3>
          <p className="text-primary-darkest text-[15px]">
            Pantau aktivitas order dari agen dan status agen yang Anda kelola. Semua dalam satu tampilan ringkas.
          </p>
        </div>

        {/* Riwayat Order */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-all duration-300 p-6">
            <div className="bg-secondary-light w-12 h-9 rounded-lg flex items-center justify-center mb-4">
                <img src={iconValidasi } alt="Icon Produksi" className="w-6 h-5" />
            </div>
          <h3 className="font-bold text-primary-dark mb-2">Validasi Order</h3>
          <p className="text-primary-darkest text-[15px]">
            Tinjau dan validasi permintaan order yang masuk dari agen sebelum diteruskan ke pabrik.
          </p>
        </div>

        {/* Tagihan */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-all duration-300 p-6">
          <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
            <FaMoneyBillWave className="text-primary-dark text-xl" />
          </div>
          <h3 className="font-bold text-primary-dark mb-2">Daftar Harga</h3>
          <p className="text-primary-darkest text-[15px]">
            Kelola dan sesuaikan daftar harga produk yang akan ditawarkan ke agen berdasarkan kebijakan distribusi Anda.
          </p>
        </div>
      </div>
    </section>
  );
}
