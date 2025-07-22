import React from "react";
import fiturImg from "../../assets/beranda/fitur.png";
import Checklist from "../../assets/icons/checklist.png";

const FiturUtamaHome = () => {
  return (
    <section className="py-20 px-6 md:px-16" data-aos="fade-up">
      {/* Heading */}
      <h2 className="md:text-3xl font-bold text-center text-primary-dark mb-12">
        Fitur Utama Yang Kami Tawarkan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Gambar fitur */}
        <div className="flex justify-center">
          <img
            src={fiturImg}
            alt="Fitur Aplikasi"
            className="max-w-md rounded-lg shadow"
          />
        </div>

        {/* List fitur */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[17px]">
          <div className="flex gap-3">
            <img
              src={Checklist}
              alt="Checklist icon"
              className="w-5 h-5 mt-1 flex-shrink-0"
            />
            <div>
              <h3 className="font-bold text-primary-dark text-base">
                Form Permintaan Order
              </h3>
              <p className="text-primary-darkest text-[15px] ">
                Agen dapat membuat permintaan order dengan mudah.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <img
              src={Checklist}
              alt="Checklist icon"
              className="w-5 h-5 mt-1 flex-shrink-0"
            />
            <div>
              <h3 className="font-bold text-primary-dark text-base">
                Validasi & Forward Order
              </h3>
              <p className="text-primary-darkest text-[15px] ">
                Distributor dapat menyetujui dan meneruskan permintaan ke pabrik.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <img
              src={Checklist}
              alt="Checklist icon"
              className="w-5 h-5 mt-1 flex-shrink-0"
            />
            <div>
              <h3 className="font-bold text-primary-dark text-base">
                Monitoring Produksi & Pengiriman
              </h3>
              <p className="text-primary-darkest text-[15px]">
                Pabrik dapat memperbarui status pengiriman secara real-time.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <img
              src={Checklist}
              alt="Checklist icon"
              className="w-5 h-5 mt-1 flex-shrink-0"
            />
            <div>
              <h3 className="font-bold text-primary-dark text-base">
                Notifikasi Status & Tagihan
              </h3>
              <p className="text-primary-darkest text-[15px]">
                Semua pengguna mendapatkan update otomatis terkait order dan invoice.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <img
              src={Checklist}
              alt="Checklist icon"
              className="w-5 h-5 mt-1 flex-shrink-0"
            />
            <div>
              <h3 className="font-bold text-primary-dark text-base">
                Upload Invoice & Riwayat
              </h3>
              <p className="text-primary-darkest text-[15px]">
                Sistem menyimpan riwayat pemesanan dan tagihan dengan rapi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiturUtamaHome;
