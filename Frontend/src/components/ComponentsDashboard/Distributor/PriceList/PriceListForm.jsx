// src/components/distributor/pabrikpricelist/PriceListForm.jsx
import React from 'react';
import iconTambah from '../../../assets/IconHeader/IconTambah.png';

const PriceListForm = ({ form, setForm, handleAdd, hargaLabel = "Harga Pabrik" }) => (
    <>
        <div className="flex items-center gap-2 mb-4">
            <img src={iconTambah} alt="icon tambah" className="w-5 h-5" />
            <span className="text-blue-900 font-semibold text-sm">Tambah Produk Baru</span>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
            <input
                type="text"
                placeholder="Nama Produk"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-1/4"
            />
            <input
                type="text"
                placeholder="Kode Produk"
                value={form.kode}
                onChange={(e) => setForm({ ...form, kode: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-1/4"
            />
            <input
                type="text"
                placeholder={hargaLabel}
                value={form.harga}
                onChange={(e) => setForm({ ...form, harga: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-1/4"
            />
            <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 font-bold"
            >
                Tambah
            </button>
        </div>
    </>
);

export default PriceListForm;
