// src/components/distributor/pabrikpricelist/PriceListForm.jsx
import React from 'react';
import iconTambah from '../../../../assets/IconHeader/IconTambah.png';

const PriceListForm = ({ form, setForm, handleAdd, hargaLabel = "Harga Pabrik" }) => (
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
                className="form-input"
            />
            <input
                type="text"
                placeholder="Kode Produk"
                value={form.kode}
                onChange={(e) => setForm({ ...form, kode: e.target.value })}
                className="form-input"
            />
            <input
                type="text"
                placeholder={hargaLabel}
                value={form.harga}
                onChange={(e) => setForm({ ...form, harga: e.target.value })}
                className="form-input"
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
