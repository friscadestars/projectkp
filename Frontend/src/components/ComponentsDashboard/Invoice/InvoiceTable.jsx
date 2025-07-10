import React from 'react';

const InvoiceTable = ({ products }) => {
    const isEmpty = !products || products.length === 0;

    return (
        <table className="w-full table-auto border border-gray-300 mb-6">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border px-4 py-2 text-left">Nama Produk</th>
                    <th className="border px-4 py-2 text-right">Jumlah</th>
                    <th className="border px-4 py-2 text-right">Harga Satuan</th>
                    <th className="border px-4 py-2 text-right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {isEmpty ? (
                    <tr className="text-sm">
                        <td className="border px-4 py-2">-</td>
                        <td className="border px-4 py-2 text-right">0</td>
                        <td className="border px-4 py-2 text-right">Rp 0</td>
                        <td className="border px-4 py-2 text-right">Rp 0</td>
                    </tr>
                ) : (
                    products.map((product, i) => {
                        const hargaAngka = parseInt(
                            (product.harga || '0').toString().replace(/[^\d]/g, '')
                        );
                        const subtotal = (product.jumlah || 0) * hargaAngka;

                        return (
                            <tr key={i} className="text-sm">
                                <td className="border px-4 py-2">{product.nama || '-'}</td>
                                <td className="border px-4 py-2 text-right">{product.jumlah || 0}</td>
                                <td className="border px-4 py-2 text-right">
                                    Rp {hargaAngka.toLocaleString('id-ID')}
                                </td>
                                <td className="border px-4 py-2 text-right">
                                    Rp {subtotal.toLocaleString('id-ID')}
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
};

export default InvoiceTable;
