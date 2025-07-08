import React from "react";
import { FaArrowRight } from "react-icons/fa"; // pakai react-icons untuk panah
import iconAgen from "../../assets/icons/homepage/agen.png";
import iconDistributor from "../../assets/icons/homepage/distributor.png";
import iconPabrik from "../../assets/icons/homepage/pabrik.png";

export default function CaraKerja() {
  return (
    <section className="bg-secondary py-20 px-6 md:px-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-primary-dark mb-12">
        Cara Kerja OrderLink
      </h2>

      {/* Cards */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        {/* Agen */}
        <div className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition w-72">
            <div className="bg-secondary-light w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <img src={iconAgen} alt="Icon Agen" className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-primary-dark mb-2">Agen</h3>
            <p className="text-primary-darkest text-[15px] mb-4 leading-relaxed ">
                Agen mengajukan permintaan barang ke Distributor
            </p>
        </div>
        <FaArrowRight className="text-primary-dark 0 text-2xl hidden md:inline" />

        {/* Distributor */}
        <div className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition  w-72">
          <div className="bg-secondary-light w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <img src={iconDistributor} alt="Icon Agen" className="w-6 h-6" />
            </div>
          <h3 className="text-base font-bold text-primary-dark mb-2">Distributor</h3>
          <p className="text-primary-darkest text-[15px] mb-4 leading-relaxed">
            Distributor memvalidasi permintaan, mengatur harga, dan meneruskannya ke pabrik
          </p>
        </div>
        <FaArrowRight className="text-primary-dark text-2xl hidden md:inline" />

        {/* Pabrik */}
        <div className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition  w-72">
          <div className="bg-secondary-light w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <img src={iconPabrik} alt="Icon Agen" className="w-6 h-6" />
            </div>
          <h3 className="text-base font-bold text-primary-dark mb-2">Pabrik</h3>
          <p className="text--primary-darkest text-[15px] mb-4 leading-relaxed">
            Pabrik mengelola produksi & pengiriman, serta membuat tagihan
          </p>
        </div>
      </div>
    </section>
  );
}
