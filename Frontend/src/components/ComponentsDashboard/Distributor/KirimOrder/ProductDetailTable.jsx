// src/Components/Distributor/KirimOrder/ProductDetailTable.jsx
import React from 'react';

const ProductDetailTable = ({ products }) => {
    if (!Array.isArray(products) || products.length === 0) {
        return <p className="text-sm text-gray-500 italic mb-4">Tidak ada produk dalam order ini.</p>;
    }

    return (
        <div className="mb-6">
            <h2 className="font-semibold text-md mb-2">Rincian Produk</h2>
            <table className="w-1/2 border-collapse text-sm text-center">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="py-2 px-4 border-b border-gray-300">Nama Produk</th>
                        <th className="py-2 px-4 border-b border-gray-300">Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index} className="border-b border-gray-300">
                            <td className="py-2 px-4">{product.name}</td>
                            <td className="py-2 px-4">{product.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductDetailTable;
