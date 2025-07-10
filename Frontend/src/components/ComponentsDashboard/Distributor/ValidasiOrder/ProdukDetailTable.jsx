const ProdukDetailTable = ({ products, inputPrices, handleSetHarga }) => (
    <>
        <h2 className="font-semibold text-md mb-2">Rincian Produk</h2>
        <table className="w-full border text-sm text-center">
            <thead>
                <tr className="bg-blue-900 text-white">
                    <th className="py-2 px-4">Nama Produk</th>
                    <th className="py-2 px-4">Jumlah</th>
                    <th className="py-2 px-4">Harga Agen</th>
                    <th className="py-2 px-4">Harga Pabrik</th>
                    <th className="py-2 px-4">Set Harga</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <tr key={index} className="border-b">
                        <td className="py-2 px-4">{product.name}</td>
                        <td className="py-2 px-4">{product.quantity}</td>
                        <td className="py-2 px-4">Rp {product.requestedPrice.toLocaleString()}</td>
                        <td className="py-2 px-4">
                            Rp {product.unitPrice > 0 ? product.unitPrice.toLocaleString() : '0'}
                        </td>
                        <td className="py-2 px-4">
                            <input
                                type="text"
                                placeholder="Rp"
                                value={inputPrices[index]?.price}
                                onChange={e => handleSetHarga(index, e.target.value)}
                                className="border rounded px-2 py-1 w-28 text-sm"
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
);

export default ProdukDetailTable;
