// src/Components/Distributor/Riwayat/ProductDetailTable.jsx
import React from 'react';

const ProductDetailTable = ({ products }) => (
    <>
        <h2 className="font-semibold text-md mb-3">Rincian Produk</h2>
        <table className="min-w-full border-collapse text-sm text-left">
            <thead>
                <tr className="bg-blue-900 text-white">
                    <th className="px-4 py-2 border-b">Nama Produk</th>
                    <th className="px-4 py-2 border-b">Jumlah</th>
                    <th className="px-4 py-2 border-b">Harga Satuan Agen</th>
                    <th className="px-4 py-2 border-b">Harga Satuan Pabrik</th>
                </tr>
            </thead>
            <tbody>
                {products.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{item.nama}</td>
                        <td className="px-4 py-2">{item.jumlah}</td>
                        <td className="px-4 py-2">{item.hargaAgen}</td>
                        <td className="px-4 py-2">{item.hargaPabrik}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
);

export default ProductDetailTable;
