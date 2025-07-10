import React, { useState } from 'react';

const PriceListTable = ({
    filteredProduk,
    handleEdit,
    handleSave,
    handleDelete,
    hargaHeader = "Harga Pabrik"
}) => {
    const [editedPrices, setEditedPrices] = useState({});

    const handleInputChange = (id, value) => {
        // Hilangkan karakter non-digit, misalnya "Rp", ".", dll
        const cleanValue = value.replace(/[^\d]/g, '');
        setEditedPrices((prev) => ({
            ...prev,
            [id]: cleanValue
        }));
    };

    const handleSaveClick = (id) => {
        const numericValue = parseInt(editedPrices[id]);
        handleSave(id, numericValue); // kirim angka bersih
        setEditedPrices((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });
    };

    const formatRupiah = (value) => {
        const number = parseInt(value);
        if (isNaN(number)) return 'Rp 0';
        return 'Rp ' + number.toLocaleString('id-ID');
    };

    return (
        <div className="overflow-x-auto mt-4">
            <table className="min-w-full border-collapse text-sm text-center">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="px-4 py-2 border-b border-gray-300">No</th>
                        <th className="px-4 py-2 border-b border-gray-300">Nama Produk</th>
                        <th className="px-4 py-2 border-b border-gray-300">Kode Produk</th>
                        <th className="px-4 py-2 border-b border-gray-300">{hargaHeader}</th>
                        <th className="px-4 py-2 border-b border-gray-300">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProduk.map((produk, index) => {
                        const editedValue = editedPrices[produk.id];
                        const displayedHarga = produk.isEditing
                            ? editedValue ?? produk.harga
                            : formatRupiah(produk.harga);

                        return (
                            <tr key={produk.id} className="border-b border-gray-300 hover:bg-gray-50">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{produk.nama}</td>
                                <td className="px-4 py-2">{produk.kode}</td>
                                <td className="px-4 py-2">
                                    {produk.isEditing ? (
                                        <input
                                            type="text"
                                            className="border border-gray-300 px-2 py-1 rounded text-sm w-28 text-center"
                                            value={formatRupiah(editedValue ?? produk.harga)}
                                            onChange={(e) => handleInputChange(produk.id, e.target.value)}
                                        />
                                    ) : (
                                        displayedHarga
                                    )}
                                </td>
                                <td className="px-4 py-2 flex justify-center gap-2">
                                    {produk.isEditing ? (
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold"
                                            onClick={() => handleSaveClick(produk.id)}
                                        >
                                            Simpan
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-blue-800 text-white px-3 py-1 rounded text-sm font-bold"
                                            onClick={() => handleEdit(produk.id)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold"
                                        onClick={() => handleDelete(produk.id)}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    {filteredProduk.length === 0 && (
                        <tr>
                            <td colSpan="5" className="py-4 text-gray-500 italic">
                                Tidak ada data produk.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PriceListTable;
