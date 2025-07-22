import React from "react";
import Email from "../../assets/icons/email.png";
import WhatsApp from "../../assets/icons/whatsapp.png";
import Instagram from "../../assets/icons/instagram.png";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-10 px-6 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="font-bold text-lg mb-4">OrderLink</h3>
          <p className="text-gray-300">
            Kami berkomitmen memberikan layanan terbaik untuk mendukung
            pengelolaan distribusi bisnis Anda secara efisien.
          </p>
        </div>

        {/* Jelajahi */}
        <div>
          <h4 className="font-semibold mb-2">Jelajahi</h4>
          <ul className="space-y-1 text-gray-300">
            <li>
              <a href="/" className="hover:underline transition">
                Beranda
              </a>
            </li>
            <li>
              <a href="/tentang" className="hover:underline transition">
                Tentang
              </a>
            </li>
            <li>
              <a href="/fitur" className="hover:underline transition">
                Fitur
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:underline transition">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-gray-300">
            <li>
              <a href="#" className="hover:underline transition">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline transition">
                Privacy
              </a>
            </li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h4 className="font-semibold mb-2">Kontak</h4>
          <div className="flex gap-4">
            <a href="#">
              <img
                src={Email}
                alt="Email"
                className="w-8 h-8 rounded-full hover:opacity-80 transition"
              />
            </a>
            <a href="#">
              <img
                src={WhatsApp}
                alt="WhatsApp"
                className="w-8 h-8 rounded-full hover:opacity-80 transition"
              />
            </a>
            <a href="#">
              <img
                src={Instagram}
                alt="Instagram"
                className="w-8 h-8 rounded-full hover:opacity-80 transition"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-secondary mt-8 pt-4 text-center text-secondary">
        © 2025 OrderLink. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
