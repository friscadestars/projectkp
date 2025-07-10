// src/Components/Shared/RincianProdukTable.jsx
import React from 'react';

const RincianProdukTable = ({ products = [], status = '', showTotal = true }) => {
    const total = products.reduce((sum, p) => {
        const hargaSatuan = status === 'Tertunda' ? p.requestedPrice : p.unitPrice;
        return sum + hargaSatuan * p.quantity;
    }, 0);

    if (products.length === 0) {
        return <p className="text-gray-500 italic">Tidak ada produk.</p>;
    }

    return (
        <div>
            <h2 className="text-lg font-semibold mb-3">Rincian Produk</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-center mt-4 border border-gray-200 rounded-md">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="px-4 py-2">Nama Produk</th>
                            <th className="px-4 py-2">Jumlah</th>
                            <th className="px-4 py-2">Harga Satuan</th>
                            <th className="px-4 py-2">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p, i) => {
                            const hargaSatuan = status === 'Tertunda' ? p.requestedPrice : p.unitPrice;
                            const subtotal = hargaSatuan * p.quantity;
                            return (
                                <tr key={i} className="border-b">
                                    <td className="px-4 py-2">{p.name}</td>
                                    <td className="px-4 py-2">{p.quantity}</td>
                                    <td className="px-4 py-2">Rp. {hargaSatuan.toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-2">Rp. {subtotal.toLocaleString('id-ID')}</td>
                                </tr>
                            );
                        })}
                        {showTotal && (
                            <tr className="font-bold bg-gray-100">
                                <td className="px-4 py-2 text-left" colSpan={3}>Total</td>
                                <td className="px-4 py-2">Rp. {total.toLocaleString('id-ID')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RincianProdukTable;
