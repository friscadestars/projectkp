import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "Apakah aplikasi ini gratis?",
    answer:
      "Ya, versi dasar aplikasi ini dapat digunakan secara gratis oleh semua role pengguna.",
  },
  {
    question: "Bagaimana cara mendaftar sebagai Agen atau Distributor?",
    answer:
      "Anda dapat mendaftar dengan memilih role saat proses pembuatan akun.",
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
];

const FAQHome = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null); // Close if already open
    } else {
      setOpenIndex(index); // Open selected FAQ
    }
  };

  return (
    <section className="bg-gray-50 py-20 px-6 md:px-16" data-aos="fade-up">
      <h2 className="text-3xl md:text-3xl font-bold text-center text-primary-dark mb-8">
        Pertanyaan Umum
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition relative"
          >
            {/* Icon Expand/Collapse */}
            <button
              onClick={() => toggleFAQ(index)}
              className="absolute top-4 right-4 text-primary-dark focus:outline-none"
            >
              {openIndex === index ? <FaMinus /> : <FaPlus />}
            </button>

            <h4 className="font-medium text-primary-darkest mb-2">
              {faq.question}
            </h4>
            {openIndex === index && (
              <p className="text-gray-600 mt-2 transition-all duration-300">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQHome;
