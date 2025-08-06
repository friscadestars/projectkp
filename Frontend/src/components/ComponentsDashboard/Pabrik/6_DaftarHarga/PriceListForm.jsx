// Pabrik

import React from 'react';
import iconTambah from '../../../../assets/IconHeader/IconTambah.png';

//const PriceListForm = ({ form, setForm, handleAdd, hargaLabel = "Harga" }) => (
const PriceListForm = ({ form = {}, setForm, handleAdd, hargaLabel = "Harga" }) => (

    <>
        <div className="form-header">
            <img src={iconTambah} alt="icon tambah" className="form-header-icon" />
            <span className="form-header-title">Tambah Produk Baru</span>
        </div>

        <div className="form-input-group">
            <input
                type="text"
                placeholder="Nama Produk"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className={`border border-gray-400 px-3 py-2 rounded text-sm ${form.nama ? 'text-black' : 'text-gray-400'} w-[300px]`}
            />
            <input
                type="text"
                placeholder="Kode Produk"
                value={form.kode}
                onChange={(e) => setForm({ ...form, kode: e.target.value })}
                className={`border border-gray-400 px-3 py-2 rounded text-sm ${form.kode ? 'text-black' : 'text-gray-400'} w-[300px]`}
            />
            <input
                type="text"
                placeholder={hargaLabel}
                value={form.harga}
                onChange={(e) => setForm({ ...form, harga: e.target.value })}
                className={`border border-gray-400 px-3 py-2 rounded text-sm ${form.harga ? 'text-black' : 'text-gray-400'} w-[300px]`}
            />
            <button
                onClick={handleAdd}
                className="form-submit-button"
            >
                Tambah
            </button>
        </div>
    </>
);

export default PriceListForm;
