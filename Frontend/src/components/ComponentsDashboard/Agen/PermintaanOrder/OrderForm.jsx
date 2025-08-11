import React from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const OrderForm = ({
    produk, jumlah, harga, produkList, alamat,
    setProduk, setJumlah, setHarga, setAlamat,
    handleAddProduk, handleDeleteProduk,
    orderId, agentName, distributorName, orderDate,
    produkListDropdown,
    children
}) => {
    return (
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 sm:p-6 space-y-6">
            {/* Informasi Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                    type="text"
                    placeholder="Order ID"
                    value={orderId}
                    readOnly
                    className="border border-gray-400 px-3 py-2 rounded text-xs sm:text-sm text-gray-400 w-full"
                />
                <input
                    type="text"
                    placeholder="Agen"
                    value={agentName}
                    readOnly
                    className="border border-gray-400 px-3 py-2 rounded text-xs sm:text-sm text-gray-400 w-full"
                />
                <input
                    type="text"
                    placeholder="Tanggal Order"
                    value={orderDate}
                    readOnly
                    className="border border-gray-400 px-3 py-2 rounded text-xs sm:text-sm text-gray-400 w-full"
                />
                <input
                    type="text"
                    placeholder="Distributor"
                    value={distributorName}
                    readOnly
                    className="border border-gray-400 px-3 py-2 rounded text-xs sm:text-sm text-gray-400 w-full"
                />
            </div>

            {/* Alamat Pengiriman */}
            <input
                type="text"
                placeholder="Alamat Pengiriman"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className={`border border-gray-400 px-3 py-2 rounded w-full text-xs sm:text-sm ${alamat ? 'text-black' : 'text-gray-400'}`}
            />

            {/* Tambah Produk */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                <select
                    value={produk?.kode_produk || ''}
                    onChange={(e) => {
                        const selected = produkListDropdown.find(p => p.kode_produk === e.target.value);
                        setProduk(selected || null);
                    }}
                    className={`border border-gray-400 px-3 py-2 rounded text-xs sm:text-sm ${produk ? 'text-black' : 'text-gray-400'}`}
                >
                    <option value="">Pilih Produk</option>
                    {produkListDropdown.map((item) => (
                        <option key={item.kode_produk} value={item.kode_produk}>
                            {item.nama_produk}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Jumlah"
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    className={`border border-gray-400 px-3 py-2 rounded text-xs sm:text-sm ${jumlah ? 'text-black' : 'text-gray-400'}`}
                />
                <input
                    type="number"
                    placeholder="Harga Satuan Request"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    className={`border border-gray-400 px-3 py-2 rounded text-xs sm:text-sm ${harga ? 'text-black' : 'text-gray-400'}`}
                />
                <button
                    onClick={handleAddProduk}
                    className="bg-black text-white w-full sm:w-8 h-8 rounded flex items-center justify-center"
                >
                    <FiPlus className="text-sm" />
                </button>
            </div>

            {/* Tabel Produk */}
            <div className="overflow-x-auto mt-6">
                <table className="min-w-full text-xs sm:text-sm text-center border">
                    <thead>
                        <tr className="bg-blue-900 text-white">
                            <th className="px-2 sm:px-4 py-2">Nama Produk</th>
                            <th className="px-2 sm:px-4 py-2">Jumlah</th>
                            <th className="px-2 sm:px-4 py-2">Harga Request</th>
                            <th className="px-2 sm:px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produkList.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-2 sm:px-4 py-2">{item.nama_produk || '-'}</td>
                                <td className="px-2 sm:px-4 py-2">{item.jumlah || '-'}</td>
                                <td className="px-2 sm:px-4 py-2">
                                    {typeof item.harga === "number"
                                        ? `Rp ${item.harga.toLocaleString("id-ID")}`
                                        : "Rp -"}
                                </td>
                                <td className="px-2 sm:px-4 py-2">
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
            <div className="pt-4 text-center">
                {children}
            </div>
        </div>
    );
};

export default OrderForm;
