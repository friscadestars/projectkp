import React from 'react';

const ProdukDetailTable = ({ products, inputPrices, handleSetHarga }) => {
    const isValidPrice = (value) => !isNaN(parseFloat(value)) && isFinite(value);

    const totalHarga = inputPrices.reduce((sum, item, i) => {
        const quantity = products[i]?.quantity || 0;
        const price = parseFloat(item.price);
        return isValidPrice(price) ? sum + (price * quantity) : sum;
    }, 0);

    return (
        <div>
            <h2 className="text-lg font-semibold mb-3">Rincian Produk</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-center mt-4 border border-gray-300 rounded-md border-collapse">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="px-4 py-2 border-b border-gray-300">Nama Produk</th>
                            <th className="px-4 py-2 border-b border-gray-300">Jumlah</th>
                            <th className="px-4 py-2 border-b border-gray-300">Harga Agen</th>
                            <th className="px-4 py-2 border-b border-gray-300">Harga Pabrik</th>
                            <th className="px-4 py-2 border-b border-gray-300">Set Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index} className="hover:bg-gray-50 border-b border-gray-300">
                                <td className="px-4 py-2">{product.name}</td>
                                <td className="px-4 py-2">{product.quantity}</td>
                                <td className="px-4 py-2">Rp {product.requestedPrice.toLocaleString('id-ID')}</td>
                                <td className="px-4 py-2">
                                    Rp {product.unitPrice > 0 ? product.unitPrice.toLocaleString('id-ID') : '0'}
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="text"
                                        placeholder="Rp"
                                        value={inputPrices[index]?.price}
                                        onChange={e => handleSetHarga(index, e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1 w-28 text-sm"
                                    />
                                </td>
                            </tr>
                        ))}
                        {totalHarga > 0 && (
                            <tr className="font-bold bg-gray-100">
                                <td className="px-4 py-2 text-left border border-gray-300" colSpan={4}>
                                    Total
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    Rp {totalHarga.toLocaleString('id-ID')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProdukDetailTable;
