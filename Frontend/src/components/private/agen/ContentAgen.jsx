import React from "react";
import { FaClipboardList, FaHistory, FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ContentAgen() {
  return (
    <section className="py-16 px-6 md:px-20">
      {/* Judul & Subteks */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-2xl font-bold text-primary-dark mb-8">
          Ingin Mengajukan Order Dengan Mudah?
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 inline-block">
          <p className="text-primary-darkest text-base mb-3">
            Kelola semua aktivitas pemesanan Anda seperti permintaan order, status
            pengiriman, riwayat pemesanan, dan tagihan melalui menu <b>Dashboard</b>
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
          <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
            <FaClipboardList className="text-primary-dark text-xl" />
          </div>
          <h3 className="font-bold text-primary-dark mb-2">Permintaan Order</h3>
          <p className="text-primary-darkest text-[15px]">
            Ajukan permintaan barang ke distributor Anda secara cepat dan mudah. Pastikan Anda memasukkan data permintaan dengan benar.
          </p>
        </div>

        {/* Riwayat Order */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-all duration-300 p-6">
          <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
            <FaHistory className="text-primary-dark text-xl" />
          </div>
          <h3 className="font-bold text-primary-dark mb-2">Riwayat Order</h3>
          <p className="text-primary-darkest text-[15px]">
            Lihat seluruh riwayat permintaan Anda, lengkap dengan status dan detail proses distribusinya.
          </p>
        </div>

        {/* Tagihan */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-all duration-300 p-6">
          <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
            <FaMoneyBillWave className="text-primary-dark text-xl" />
          </div>
          <h3 className="font-bold text-primary-dark mb-2">Tagihan</h3>
          <p className="text-primary-darkest text-[15px]">
            Akses informasi tagihan dari distributor, termasuk jumlah pembayaran, status, dan tanggal jatuh tempo.
          </p>
        </div>
      </div>
    </section>
  );
}
