import React from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const OrderForm = ({
    produk, jumlah, harga, produkList, alamat,
    setProduk, setJumlah, setHarga, setAlamat,
    handleAddProduk, handleDeleteProduk,
    orderId, agentId, distributorName, orderDate,
    children
}) => {
    return (
        <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6 space-y-6">
            {/* Informasi Agen, Distributor, Tanggal, Alamat */}
            <div className="grid grid-cols-4 gap-4">
                <input type="text" value={orderId} readOnly className="border border-gray-300 px-3 py-2 rounded text-sm" />
                <input type="text" value={agentId} readOnly className="border border-gray-300 px-3 py-2 rounded text-sm" />
                <input type="text" value={orderDate} readOnly className="border border-gray-300 px-3 py-2 rounded text-sm" />
                <input type="text" value={distributorName} readOnly className="border border-gray-300 px-3 py-2 rounded text-sm" />
            </div>

            {/* Alamat Pengiriman */}
            <input
                type="text"
                placeholder="Alamat Pengiriman"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
            />

            {/* Tambah Produk */}
            <div className="grid grid-cols-4 gap-4 items-center">
                <input
                    type="text"
                    placeholder="Nama Produk"
                    value={produk}
                    onChange={(e) => setProduk(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded text-sm"
                />
                <input
                    type="number"
                    placeholder="Jumlah"
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded text-sm"
                />
                <input
                    type="number"
                    placeholder="Harga Request"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded text-sm"
                />
                <button
                    onClick={handleAddProduk}
                    className="bg-black text-white w-8 h-8 rounded flex items-center justify-center"
                >
                    <FiPlus className="text-sm" />
                </button>
            </div>

            {/* Tabel Produk */}
            <div className="overflow-x-auto mt-6">
                <table className="min-w-full text-sm text-center border border-gray-300 border-collapse rounded-md">
                    <thead>
                        <tr className="bg-blue-900 text-white">
                            <th className="px-4 py-2 border-b border-gray-300">Nama Produk</th>
                            <th className="px-4 py-2 border-b border-gray-300">Jumlah</th>
                            <th className="px-4 py-2 border-b border-gray-300">Harga Request</th>
                            <th className="px-4 py-2 border-b border-gray-300">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produkList.map((item, index) => (
                            <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                                <td className="px-4 py-2">{item.nama}</td>
                                <td className="px-4 py-2">{item.jumlah}</td>
                                <td className="px-4 py-2">Rp {item.harga.toLocaleString("id-ID")}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDeleteProduk(index)}
                                        className="bg-black text-white px-2 py-1 rounded"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {produkList.length === 0 && (
                            <tr>
                                <td colSpan="4" className="py-4 italic text-gray-500">
                                    Belum ada produk ditambahkan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Tombol Submit */}
            <div className="pt-4 text-right">
                {children}
            </div>
        </div>
    );
};

export default OrderForm;
