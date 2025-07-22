import React from "react";
import heroImg from "../../assets/beranda/hero.png";
import { Link } from "react-router-dom";

const HeroHome = () => {
  return (
    <section className="bg-white mt-20 mr-10 py-20 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between" data-aos="zoom-in">
      {/* Left Side - Text */}
      <div className="max-w-xl">
        <h1 className="text-3xl font-extrabold font-inter text-primary-dark mb-4">
          Kelola Order & Distribusi <br /> Lebih Mudah
        </h1>
        <p className="text--primary-darkest text-[17px] mb-4 leading-relaxed ">
          Aplikasi ini membantu agen, distributor, dan pabrik dalam mengelola permintaan order,
          validasi distribusi, pengiriman, dan tagihan secara terintegrasi dan efisien.
        </p>
        <Link
          to="/masuk"
          className="inline-block border text-sm bg-primary-dark hover:bg-blue-800 text-white font-semibold py-2 px-5 rounded-xl pt-3 pb-3 hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          Mulai Sekarang
        </Link>
      </div>

      {/* Right Side - Image */}
      <div className="mt-10 md:mt-0">
        <img
          src={heroImg}
          alt="Delivery Illustration"
          className="w-full max-w-md"
        />
      </div>
    </section>
  );
};

export default HeroHome;
