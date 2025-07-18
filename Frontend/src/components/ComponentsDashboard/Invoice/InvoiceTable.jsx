import React from 'react';
import ReusableTable from '../Common/ReusableTable';

const InvoiceTable = ({ products = [] }) => {
    const columns = [
        {
            key: 'nama',
            label: 'Nama Produk',
        },
        {
            key: 'jumlah',
            label: 'Jumlah',
            render: (val) => (
                <div className="text-right">{val || 0}</div>
            ),
        },
        {
            key: 'harga',
            label: 'Harga Satuan',
            render: (val) => {
                const numeric = parseInt((val || '0').toString().replace(/[^\d]/g, ''));
                return <div className="text-right">Rp {numeric.toLocaleString('id-ID')}</div>;
            },
        },
        {
            key: 'subtotal',
            label: 'Subtotal',
            render: (_, row) => {
                const hargaAngka = parseInt((row.harga || '0').toString().replace(/[^\d]/g, ''));
                const subtotal = (row.jumlah || 0) * hargaAngka;
                return <div className="text-right">Rp {subtotal.toLocaleString('id-ID')}</div>;
            },
        },
    ];

    // Karena subtotal dihitung manual, kita tidak butuh key `subtotal` di objek.
    const data = products.map(p => ({
        ...p,
        subtotal: null, // placeholder supaya render tetap jalan
    }));

    return (
        <ReusableTable
            columns={columns}
            data={data}
            className="w-full table-auto border border-gray-300 mb-6 text-sm"
        />
    );
};

export default InvoiceTable;
