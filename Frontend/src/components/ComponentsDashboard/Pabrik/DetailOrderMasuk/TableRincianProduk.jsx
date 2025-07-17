import React from 'react';

const TabelRincianProduk = ({ products = [] }) => {
    if (products.length === 0) {
        return <p className="text-gray-500 italic">Tidak ada produk.</p>;
    }

    return (
        <div>
            <h2 className="text-lg font-semibold mb-1.5">Rincian Produk</h2>
            {/* Wrapper tabel dengan rounded */}
            <div className="rounded-xl border border-gray-200 shadow overflow-hidden">
                <table className="min-w-full text-sm text-center whitespace-nowrap">
                    <thead className="bg-primary-dark text-white">
                        <tr>
                            <th className="px-4 py-2 border border-gray-300">Nama Produk</th>
                            <th className="px-4 py-2 border border-gray-300">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border border-gray-300">{p.name}</td>
                                <td className="px-4 py-2 border border-gray-300">{p.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-end">
                <button className="bg-btn-info text-white px-4 py-2 rounded hover:bg-btn-primary font-semibold">
                    Mulai Produksi
                </button>
            </div>
        </div>
    );
};


export default TabelRincianProduk;
