import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const fiturData = [
  {
    title: "Fitur Agen",
    features: [
      {
        name: "Ringkasan Order",
        desc: "Lihat rekap aktivitas pesanan Anda, termasuk status terkini.",
      },
      {
        name: "Permintaan Order",
        desc: "Ajukan permintaan barang ke distributor dengan mudah.",
      },
      {
        name: "Riwayat Order",
        desc: "Telusuri daftar permintaan yang pernah diajukan lengkap dengan status.",
      },
      {
        name: "Tagihan",
        desc: "Akses informasi tagihan dari distributor, termasuk jumlah & jatuh tempo.",
      },
    ],
  },
  {
    title: "Fitur Distributor",
    features: [
      {
        name: "Monitoring Agen & Order",
        desc: "Pantau aktivitas agen serta status order.",
      },
      {
        name: "Validasi Order",
        desc: "Tinjau dan validasi permintaan order dari agen.",
      },
      {
        name: "Daftar Harga",
        desc: "Kelola harga produk sesuai kebijakan perusahaan.",
      },
      {
        name: "Riwayat Order",
        desc: "Lacak permintaan yang diproses atau masih antre.",
      },
      {
        name: "Tagihan",
        desc: "Pantau tagihan terkait order agen dan pabrik.",
      },
    ],
  },
  {
    title: "Fitur Produsen",
    features: [
      {
        name: "Daftar Order Masuk",
        desc: "Lihat semua order yang masuk dari distributor.",
      },
      {
        name: "Produksi & Pengiriman",
        desc: "Kelola produksi & status pengiriman barang secara real-time.",
      },
      {
        name: "Monitoring Distribusi",
        desc: "Pantau distribusi barang ke agen.",
      },
      {
        name: "Daftar Harga",
        desc: "Tentukan harga produk sesuai kapasitas produksi.",
      },
      {
        name: "Riwayat Pengiriman",
        desc: "Lihat catatan lengkap seluruh pengiriman.",
      },
    ],
  },
];

export default function FiturUtama() {
  return (
    <section className="py-16 px-6 md:px-16 bg-gray-50" data-aos="fade-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {fiturData.map((role, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow hover:shadow-lg transition duration-300"
          >
            <h3 className="text-lg font-bold text-primary-dark mb-4">{role.title}</h3>
            <ul className="space-y-3 text-primary-darkest text-[15px]">
              {role.features.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FaCheckCircle className="text-primary-dark mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-primary-dark">{item.name}</p>
                    <p className="text-primary-darkest text-[15px]">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
