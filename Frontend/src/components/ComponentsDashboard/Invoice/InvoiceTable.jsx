import React from 'react';
import ReusableTable from '../Common/ReusableTable';

const InvoiceTable = ({ products = [] }) => {
    console.log('products', products);
    const columns = [
        {
            key: 'name',
            label: 'Nama Produk',
        },
        {
            key: 'quantity',
            label: 'Jumlah',
            render: (val) => {
                const numeric = parseInt(val, 10) || 0;
                return <div className="text-center">{numeric}</div>;
            },
        },
        {
            key: 'unitPrice',
            label: 'Harga Satuan',
            render: (val) => {
                const numeric = parseInt((val || '0').toString().replace(/[^\d]/g, '')) || 0;
                return <div className="text-center">Rp {numeric.toLocaleString('id-ID')}</div>;
            },
        },
        {
            label: 'Subtotal',
            key: 'subtotal',
            render: (_, row) => {
                const harga = status === 'Tertunda' ? row.requestedPrice : row.unitPrice;
                const qty = row.quantity;
                if (typeof harga !== 'number' || typeof qty !== 'number') return '-';
                const subtotal = harga * qty;
                return `Rp. ${subtotal.toLocaleString('id-ID')}`;
            }
        }
    ];

    const data = products.map(p => ({
        ...p,
        subtotal: null, // placeholder untuk kolom render subtotal
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
