import React from 'react';
import ReusableTable from '../../Common/ReusableTable'; // pastikan path sesuai

const RincianProdukTable = ({ products = [], status = '', showTotal = true }) => {
    const total = products.reduce((sum, p) => {
        const hargaSatuan = status === 'Tertunda' ? p.requestedPrice : p.unitPrice;
        return sum + hargaSatuan * p.quantity;
    }, 0);

    if (products.length === 0) {
        return <p className="text-gray-500 italic">Tidak ada produk.</p>;
    }

    const columns = [
        { header: 'Nama Produk', key: 'name' },
        { header: 'Jumlah', key: 'quantity' },
        {
            header: 'Harga Satuan',
            key: 'unitPrice',
            render: (_, row) => {
                const harga = status === 'Tertunda' ? row.requestedPrice : row.unitPrice;
                return `Rp. ${harga.toLocaleString('id-ID')}`;
            }
        },
        {
            header: 'Subtotal',
            key: 'subtotal',
            render: (_, row) => {
                const harga = status === 'Tertunda' ? row.requestedPrice : row.unitPrice;
                const subtotal = harga * row.quantity;
                return `Rp. ${subtotal.toLocaleString('id-ID')}`;
            }
        }
    ];

    return (
        <div>
            <h2 className="text-lg font-semibold mb-3">Rincian Produk</h2>
            <ReusableTable
                columns={columns}
                data={products}
                footer={showTotal ? (
                    <tr className="font-bold bg-gray-100">
                        <td colSpan={3} className="text-left px-4 py-2">Total</td>
                        <td className="px-4 py-2">Rp. {total.toLocaleString('id-ID')}</td>
                    </tr>
                ) : null}
            />
        </div>
    );
};

export default RincianProdukTable;
