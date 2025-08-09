// import React from 'react';

import ReusableTable from '../../Common/ReusableTable';

const TabelRincianProduk = ({ products = [], onMulaiProduksi }) => {
    if (products.length === 0) {
        return <p className="text-gray-500 italic">Tidak ada produk.</p>;
    }

    const columns = [
        { label: 'Nama Produk', key: 'name' },
        { label: 'Jumlah', key: 'quantity' },
    ];

    return (
        <div>
            <h2 className="text-lg font-semibold mb-1.5">Rincian Produk</h2>
            <div className="border border-gray-200 shadow overflow-hidden">
                <ReusableTable
                    columns={columns}
                    data={products}
                    className="min-w-full text-sm text-center whitespace-nowrap"
                />
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    className="bg-btn-info text-white px-4 py-2 rounded hover:bg-btn-primary font-semibold"
                    onClick={onMulaiProduksi}
                >
                    Mulai Produksi
                </button>
            </div>
        </div>
    );
};

export default TabelRincianProduk;


