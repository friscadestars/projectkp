import React from "react";
import KenapaImg from "../../assets/tentang/kenapa-orderlink.png"; 
import Checklist from "../../assets/icons/checklist.png";

export default function KenapaOrderlink() {
  return (
    <section className="bg-gray-50 py-20 px-6 md:px-16" data-aos="fade-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Teks */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4">
            Kenapa OrderLink Dikembangkan?
          </h2>
          <p className="text-primary-darkest text-base leading-relaxed max-w-3xl mx-auto mb-6">
            Banyak proses distribusi konvensional mengalami keterlambatan,
            miskomunikasi, dan kurangnya visibilitas status. OrderLink hadir untuk:
          </p>
          <ul className="space-y-3 leading-relaxed text-[15px] ">
            <li className="flex items-start gap-3">
              <img
                src={Checklist}
                alt="Checklist icon"
                className="w-5 h-5 mt-1 flex-shrink-0"
              />
              <span>Mengurangi miskomunikasi antara agen, distributor, dan pabrik.</span>
            </li>
            <li className="flex items-start gap-3">
              <img
                src={Checklist}
                alt="Checklist icon"
                className="w-5 h-5 mt-1 flex-shrink-0"
              />
              <span>Mempercepat proses validasi & distribusi.</span>
            </li>
            <li className="flex items-start gap-3">
              <img
                src={Checklist}
                alt="Checklist icon"
                className="w-5 h-5 mt-1 flex-shrink-0"
              />
              <span>
                Memberikan notifikasi otomatis dan riwayat order yang terdokumentasi rapi.
              </span>
            </li>
          </ul>
        </div>

        {/* Gambar */}
        <div className="flex justify-center">
          <img
            src={KenapaImg}
            alt="Kenapa OrderLink Dikembangkan"
            className="max-w-md rounded-lg shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
