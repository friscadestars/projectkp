import React, { useState } from "react";
import IconTambah from "../../../../assets/IconHeader/IconTambah.png"; 

const FormTambahProduk = ({ addProduct }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !code || !price) return;
    addProduct({ name, code, price: parseInt(price, 10) });
    setName("");
    setCode("");
    setPrice("");
  };

  return (
      <div>
        <h2 className="text-lg text-primary-dark font-semibold mb-3 flex items-center gap-2">
        <img src={IconTambah} alt="Tambah Icon" className="w-3 h-3" /> {/* 👈 Icon local */}
        Tambah Produk Baru
        </h2>

        {/* Form Tambah Produk */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
            type="text"
            placeholder="Nama Produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-1/5 px-2 py-2 border border-gray-300 rounded-md text-sm"
        />
        <input
            type="text"
            placeholder="Kode Produk"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-1/5 px-2 py-2 border border-gray-300 rounded-md text-sm"
        />
        <input
            type="number"
            placeholder="Harga Pabrik"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-1/5 px-2 py-2 border border-gray-300 rounded-md text-sm"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded cursor-pointer">
            Tambah
        </button>
        </form>
    </div>
  );
};

export default FormTambahProduk;
