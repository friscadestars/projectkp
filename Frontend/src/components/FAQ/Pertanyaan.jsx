import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "Apakah aplikasi ini gratis?",
    answer:
      "Ya, versi dasar aplikasi ini dapat digunakan secara gratis oleh semua role pengguna.",
  },
  {
    question: "Bagaimana cara mendaftar sebagai Agen, Distributor, atau Pabrik?",
    answer:
      "Anda dapat mendaftar dengan memilih peran saat proses pembuatan akun. Agen didaftarkan oleh Distributor, dan Distributor didaftarkan oleh Pabrik.",
  },
  {
    question: "Bagaimana cara mengajukan permintaan order?",
    answer:
      "Setelah login sebagai Agen, Anda bisa membuka menu Permintaan Order dan mengisi formulir yang tersedia untuk memulai proses pemesanan.",
  },
  {
    question: "Apakah data pemesanan saya aman?",
    answer:
      "Ya, data disimpan secara terenkripsi dan hanya dapat diakses oleh pengguna yang berwenang.",
  },
  {
    question: "Apakah saya bisa mengganti role pengguna setelah mendaftar?",
    answer:
      "Untuk menjaga keakuratan data dan alur proses, pergantian role hanya dapat dilakukan melalui permintaan ke tim admin melalui halaman kontak.",
  },
  {
    question: "Siapa yang dapat mengakses fitur Validasi Order?",
    answer:
      "Fitur Validasi Order hanya dapat diakses oleh pengguna dengan peran Distributor.",
  },
  {
    question: "Bagaimana jika saya lupa kata sandi?",
    answer:
      "Klik tombol Hubungi Kami pada halaman masuk, lalu ikuti instruksi pemulihan melalui email Anda.",
  },
  {
    question: "Apakah ada batasan jumlah order yang bisa diajukan?",
    answer:
      "Tidak ada batasan jumlah order, namun setiap order harus melalui proses validasi oleh Distributor sebelum diproses lebih lanjut.",
  },
];

const Pertanyaan = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-20 px-6 md:px-16" data-aos="fade-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto max-w-5xl">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-all duration-300"
            >
              {/* Header: Question + Toggle Icon */}
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left text-[15px] text-primary-darkest font-medium focus:outline-none"
              >
                {faq.question}
                <span className="ml-4 text-primary-dark  font-medium">
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </button>

              {/* Answer */}
              <div
                className={`mt-3 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40" : "max-h-0"
                }`}
              >
                {openIndex === index && (
                  <p className="text-gray-600 text-[15px]">{faq.answer}</p>
                )}
              </div>
            </div>
          ))}
        </div>
    </section>
  );
};

export default Pertanyaan;
