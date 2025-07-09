import React from "react";
import heroDistributor from "../../../assets/private/hero_distributor.png";
import { Link } from "react-router-dom";

const HeroDistributor = () => {
  return (
    <section className="bg-white mt-20 mr-10 py-20 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between">
      {/* Left Side - Text */}
      <div className="max-w-xl">
        <h1 className="text-3xl md:text-3xl font-extrabold font-inter text-primary-dark mb-4">
          Selamat Datang <br /> Distributor 👋
        </h1>
        <p className="text--primary-darkest text-[17px] mb-4 leading-relaxed ">
          Anda dapat memantau permintaan order dari agen, meneruskannya ke pabrik, dan juga mendaftarkan akun baru untuk Agen melalui halaman registrasi.
        </p>
        <Link
          to="/registrasi"
          className="inline-block border text-sm bg-primary-dark hover:bg-blue-800 text-white font-semibold py-2 px-5 rounded-xl pt-3 pb-3 hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          Registrasi Sekarang
        </Link>
      </div>

      {/* Right Side - Image */}
      <div className="mt-10 md:mt-0">
        <img
          src={heroDistributor}
          alt="Delivery Illustration"
          className="w-full max-w-md"
        />
      </div>
    </section>
  );
};

export default HeroDistributor;
