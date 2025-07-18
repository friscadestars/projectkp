// src/hooks/Distributor/useDistributorPriceList.js
import { useState } from "react";

export const useDistributorPriceList = () => {
    const [produkList, setProdukList] = useState([]);
    const [form, setForm] = useState({ nama: '', kode: '', harga: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleAdd = () => {
        if (!form.nama || !form.kode || !form.harga) return;
        const newId = produkList.length + 1;
        setProdukList([...produkList, { id: newId, ...form, isEditing: false }]);
        setForm({ nama: '', kode: '', harga: '' });
    };

    const handleEdit = (id) => {
        setProdukList(produkList.map(p => p.id === id ? { ...p, isEditing: true } : p));
    };

    const handleSave = (id, hargaBaru) => {
        setProdukList(produkList.map(p => p.id === id ? { ...p, harga: hargaBaru, isEditing: false } : p));
    };

    const handleDelete = (id) => {
        setProdukList(produkList.filter(p => p.id !== id));
    };

    const filteredProduk = produkList.filter(p =>
        p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.kode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        produkList,
        form,
        setForm,
        handleAdd,
        handleEdit,
        handleSave,
        handleDelete,
        searchTerm,
        setSearchTerm,
        filteredProduk
    };
};
