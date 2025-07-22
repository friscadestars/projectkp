import React from "react";
import iconAgen from "../../assets/icons/homepage/agen.png";
import iconDistributor from "../../assets/icons/homepage/distributor.png";
import iconPabrik from "../../assets/icons/homepage/pabrik.png";

const TentangHome = () => {
  return (
    <section className="bg-secondary py-20 px-6 md:px-16" data-aos="fade-up">
      {/* Heading */}
      <h2 className="text-3xl md:text-3xl font-bold text-center text-primary-dark mb-8">
        Tentang Aplikasi Kami
      </h2>

      {/* Deskripsi */}
      <p className="text-primary-darkest text-base leading-relaxed  text-center max-w-3xl mx-auto mb-12">
        Aplikasi ini dikembangkan untuk menyederhanakan proses distribusi antara agen, distributor, dan pabrik. Dengan sistem yang saling terhubung, seluruh proses pemesanan hingga pengiriman bisa dilacak secara real-time, mengurangi miskomunikasi dan mempercepat operasional bisnis Anda.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Agen */}
        <div className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition">
            <div className="bg-secondary-light w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <img src={iconAgen} alt="Icon Agen" className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-primary-dark mb-2">Agen</h3>
            <p className="text-primary-darkest text-[15px] mb-4 leading-relaxed ">
                Agen dapat membuat permintaan order, melihat riwayat pemesanan, dan mendapatkan notifikasi status.
            </p>
        </div>

        {/* Distributor */}
        <div className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition">
          <div className="bg-secondary-light w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <img src={iconDistributor} alt="Icon Agen" className="w-6 h-6" />
            </div>
          <h3 className="text-lg font-bold text-primary-dark mb-2">Distributor</h3>
          <p className="text-primary-darkest text-[15px] mb-4 leading-relaxed">
            Distributor dapat memvalidasi permintaan dari agen, memantau pengiriman, dan mengelola tagihan.
          </p>
        </div>

        {/* Pabrik */}
        <div className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition">
          <div className="bg-secondary-light w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <img src={iconPabrik} alt="Icon Agen" className="w-6 h-6" />
            </div>
          <h3 className="text-lg font-bold text-primary-dark mb-2">Pabrik</h3>
          <p className="text--primary-darkest text-[15px] mb-4 leading-relaxed">
            Pabrik dapat mengelola daftar order masuk, memproses produksi, dan mengelola invoice.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TentangHome;
