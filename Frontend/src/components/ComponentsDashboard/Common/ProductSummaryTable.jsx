import React from 'react';

const ProductSummaryTable = ({ products, inputPrices, handleSetHarga }) => {
    const isValidasiMode = inputPrices && handleSetHarga;

    return (
        <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Detail Produk</h2>
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2 text-left">Nama Produk</th>
                        <th className="border px-4 py-2 text-center">Jumlah</th>
                        {isValidasiMode ? (
                            <th className="border px-4 py-2 text-center">Harga Pabrik (Input)</th>
                        ) : (
                            <>
                                <th className="border px-4 py-2 text-center">Harga Agen</th>
                                <th className="border px-4 py-2 text-center">Harga Pabrik</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {products.map((produk, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{produk.name || produk.nama}</td>
                            <td className="border px-4 py-2 text-center">{produk.jumlah}</td>
                            {isValidasiMode ? (
                                <td className="border px-4 py-2 text-center">
                                    <input
                                        type="number"
                                        value={inputPrices[index].price}
                                        onChange={(e) => handleSetHarga(index, e.target.value)}
                                        className="border border-gray-300 px-2 py-1 rounded text-sm w-32 text-right"
                                    />
                                </td>
                            ) : (
                                <>
                                    <td className="border px-4 py-2 text-center">{produk.hargaAgen}</td>
                                    <td className="border px-4 py-2 text-center">{produk.hargaPabrik}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductSummaryTable;
