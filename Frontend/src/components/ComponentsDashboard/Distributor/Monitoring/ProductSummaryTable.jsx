import React from "react";

const ProductSummaryTable = ({ products }) => {
    const total = products.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0);

    return (
        <>
            <h2 className="font-semibold text-md mb-2">Rincian Produk</h2>
            <table className="w-full text-sm text-center border">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="py-2 px-4">Nama Produk</th>
                        <th className="py-2 px-4">Jumlah</th>
                        <th className="py-2 px-4">Harga Jual</th>
                        <th className="py-2 px-4">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p, idx) => (
                        <tr key={idx} className="border-b">
                            <td className="py-2 px-4">{p.name}</td>
                            <td className="py-2 px-4">{p.quantity}</td>
                            <td className="py-2 px-4">Rp. {p.unitPrice.toLocaleString()}</td>
                            <td className="py-2 px-4">Rp. {(p.unitPrice * p.quantity).toLocaleString()}</td>
                        </tr>
                    ))}
                    <tr className="font-semibold">
                        <td colSpan="3" className="py-2 px-4 text-right">Total</td>
                        <td className="py-2 px-4">Rp. {total.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default ProductSummaryTable;
