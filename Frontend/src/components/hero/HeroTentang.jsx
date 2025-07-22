import React from "react";
import heroTentangImg from "../../assets/tentang/hero-tentang.png";

export default function HeroTentang() {
  return (
    <section className="bg-white py-20 px-6 md:px-16 mt-20" data-aos="zoom-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Gambar */}
        <div className="flex justify-center">
          <img
            src={heroTentangImg}
            alt="Tentang OrderLink"
            className="max-w-lg rounded-lg shadow-md"
          />
        </div>

        {/* Teks */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4">
            Tentang OrderLink
          </h1>
          <p className="text-primary-darkest text-base mb-4 leading-relaxed">
            Platform manajemen order dan distribusi yang menghubungkan Agen,
            Distributor, dan Pabrik secara real-time dan efisien.
          </p>
          <p className="text-primary-darkest text-base leading-relaxed">
            OrderLink hadir untuk menyederhanakan proses distribusi barang,
            mulai dari pengajuan order, validasi, produksi, hingga pengiriman
            dalam satu sistem yang saling terhubung.
          </p>
        </div>
      </div>
    </section>
  );
}
