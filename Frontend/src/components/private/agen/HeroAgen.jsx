import React from "react";
import heroAgen from "../../../assets/private/hero_agen.png";

const HeroAgen = () => {
  return (
    <section className="bg-white mt-20 mr-10 py-20 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between">
      {/* Left Side - Text */}
      <div className="max-w-xl">
        <h1 className="text-3xl md:text-3xl font-extrabold font-inter text-primary-dark mb-4">
          Selamat Datang <br /> Agen 👋
        </h1>
        <p className="text--primary-darkest text-[17px] mb-4 leading-relaxed ">
          Anda dapat mengajukan permintaan order ke distributor, memantau status pesanan Anda, melihat riwayat pengajuan, dan mengakses informasi tagihan secara langsung melalui dashboard.
        </p>
      </div>

      {/* Right Side - Image */}
      <div className="mt-10 md:mt-0">
        <img
          src={heroAgen}
          alt="Delivery Illustration"
          className="w-full max-w-md"
        />
      </div>
    </section>
  );
};

export default HeroAgen;
