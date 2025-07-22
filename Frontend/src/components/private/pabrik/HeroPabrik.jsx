import React from "react";
import heroPabrik from "../../../assets/private/hero_pabrik.png";
import { Link } from "react-router-dom";

const HeroPabrik = () => {
  return (
    <section className="bg-white mt-20 mr-10 py-20 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between">
      {/* Left Side - Text */}
      <div className="max-w-xl">
        <h1 className="text-3xl md:text-3xl font-extrabold font-inter text-primary-dark mb-4">
          Selamat Datang <br /> Pabrik 👋
        </h1>
        <p className="text--primary-darkest text-[17px] mb-4 leading-relaxed ">
          Anda dapat melihat daftar order masuk dari distributor, mengelola proses produksi dan pengiriman barang, serta memantau kinerja distribusi.
        </p>
        <p className="text--primary-darkest text-[17px] mb-4 leading-relaxed "> 
            Jika Anda ingin menambahkan distributor baru, silakan gunakan halaman registrasi di bawah ini.
        </p>
        <Link
          to="/registrasi"
          state={{ role: "pabrik" }}
          className="inline-block border text-sm bg-primary-dark hover:bg-blue-800 text-white font-semibold py-2 px-5 rounded-xl pt-3 pb-3 hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          Registrasi Sekarang
        </Link>
      </div>

      {/* Right Side - Image */}
      <div className="mt-10 md:mt-0">
        <img
          src={heroPabrik}
          alt="Delivery Illustration"
          className="w-full max-w-md"
        />
      </div>
    </section>
  );
};

export default HeroPabrik;
