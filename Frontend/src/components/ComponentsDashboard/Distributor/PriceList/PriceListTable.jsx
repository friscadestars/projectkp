import React, { useState } from 'react';

const PriceListTable = ({
    filteredProduk,
    handleEdit,
    handleSave,
    handleDelete,
    hargaHeader = "Harga Pabrik"
}) => {
    const [editedPrices, setEditedPrices] = useState({}); // simpan harga yang sedang diedit

    const handleInputChange = (id, value) => {
        setEditedPrices((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSaveClick = (id) => {
        handleSave(id, editedPrices[id]);
        setEditedPrices((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });
    };

    return (
        <div className="overflow-x-auto mt-4">
            <table className="min-w-full border-collapse text-sm text-center">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="px-4 py-2 border-b">No</th>
                        <th className="px-4 py-2 border-b">Nama Produk</th>
                        <th className="px-4 py-2 border-b">Kode Produk</th>
                        <th className="px-4 py-2 border-b">{hargaHeader}</th>
                        <th className="px-4 py-2 border-b">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProduk.map((produk, index) => (
                        <tr key={produk.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{produk.nama}</td>
                            <td className="px-4 py-2">{produk.kode}</td>
                            <td className="px-4 py-2">
                                {produk.isEditing ? (
                                    <input
                                        type="text"
                                        className="border border-gray-300 px-2 py-1 rounded text-sm w-24 text-center"
                                        value={editedPrices[produk.id] ?? produk.harga}
                                        onChange={(e) => handleInputChange(produk.id, e.target.value)}
                                    />
                                ) : (
                                    produk.harga
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
                    ))}
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
