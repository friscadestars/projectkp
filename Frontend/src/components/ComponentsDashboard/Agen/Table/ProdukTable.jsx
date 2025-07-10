import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const ProdukTable = ({ produkList, onDelete }) => {
    return (
        <div className="overflow-x-auto mt-6">
            <table className="min-w-full text-center border border-gray-300 border-collapse rounded-md">
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
                            <td className="px-4 py-2">Rp {item.harga.toLocaleString('id-ID')}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => onDelete(index)}
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
    );
};

export default ProdukTable;
