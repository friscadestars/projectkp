import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import ReusableTable from '../../Common/ReusableTable'; // pastikan path sesuai strukturmu

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
                <button onClick={() => onDelete(index)} className="button-delete">
                    <FiTrash2 />
                </button>
            ),
        },
    ];

    return (
        <div className="order-table-container mt-6">
            <ReusableTable columns={columns} data={produkList} />
        </div>
    );
};

export default ProdukTable;
