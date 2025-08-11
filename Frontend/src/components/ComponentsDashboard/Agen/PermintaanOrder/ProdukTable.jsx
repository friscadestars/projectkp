import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import ReusableTable from '../../Common/ReusableTable';

const ProdukTable = ({ produkList, onDelete }) => {
    const columns = [
        { header: 'Nama Produk', key: 'nama_produk' },
        { header: 'Jumlah', key: 'jumlah' },
        {
            header: 'Harga Request',
            key: 'harga',
            render: (value) => `Rp ${value.toLocaleString('id-ID')}`,
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row, index) => (
                <button
                    onClick={() => onDelete(index)}
                    className="bg-black text-white px-2 py-1 rounded hover:bg-gray-800"
                >
                    <FiTrash2 />
                </button>
            ),
        },
    ];

    return (
        <div className="order-table-container mt-6 overflow-x-auto">
            <ReusableTable
                columns={columns}
                data={produkList}
                className="min-w-full text-xs sm:text-sm"
            />
        </div>
    );
};

export default ProdukTable;
