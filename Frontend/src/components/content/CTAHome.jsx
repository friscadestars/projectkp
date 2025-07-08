import React from "react";
import ctaImg from "../../assets/beranda/cta.png";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center rounded-lg mx-6 md:mx-16">
      {/* Left Side */}
      <div className="text-center md:text-left">
        <h2 className="md:text-3xl  font-bold text-primary-dark mb-4">
          Siap Untuk Mengelola Order <br /> Secara Lebih Cerdas?
        </h2>
        <p className="text-primary-darkest mb-6 text-[17px]">
          Mulailah bergabung sebagai Agen, Distributor, atau Pabrik <br /> dan nikmati kemudahan pengelolaan distribusi dalam satu aplikasi.
        </p>
        <div className="flex justify-center md:justify-start gap-4">
          <Link
            to="/masuk" //Navigasi ke Halaman "Masuk"
             className="inline-block border border-primary-dark text-primary-dark hover:text-primary-dark font-semibold py-2 px-5 rounded-xl pt-3 pb-3 hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            Masuk
          </Link>
        </div>
      </div>

      {/* Right Side */}
      <div className="mt-6 md:mt-0 flex justify-center">
        <img
          src={ctaImg}
          alt="Call to Action"
          className="max-w-md rounded-lg shadow"
        />
      </div>
    </section>
  );
};

export default CTA;
