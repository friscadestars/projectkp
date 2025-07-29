import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const OrderInfoTable = ({ order }) => {
    if (!order) return null;

    const columns = [
        { key: 'id', label: 'Order ID' },
        { key: 'agenId', label: 'Agen ID' },
        { key: 'tanggalOrder', label: 'Tanggal Order' },
        { key: 'tanggalPengiriman', label: 'Tanggal Pengiriman' },
        {
            key: 'statusPembayaran',
            label: 'Status Pembayaran',
            render: (value) => (
                <span className={`text-white text-sm px-3 py-1 rounded ${value === 'Lunas' ? 'bg-green-600' : 'bg-red-600 font-bold'}`}>
                    {value}
                </span>
            ),
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (v) => <StatusBadge status={v} />,
        },
    ];

    const data = [order];

    return (
        <div className="mb-6">
            <h2 className="font-semibold text-md mb-3">Detail Order</h2>
            <ReusableTable columns={columns} data={data} />
        </div>
    );
};

const ProductDetailTable = ({ products }) => {
    const columns = [
        { key: 'nama', label: 'Nama Produk' },
        { key: 'jumlah', label: 'Jumlah' },
        { key: 'hargaAgen', label: 'Harga Satuan Agen' },
        { key: 'hargaPabrik', label: 'Harga Satuan Pabrik' },
    ];

    const footerRow = (
        <>
            <tr>
                <td colSpan={columns.length} className="px-4 py-3 text-right font-medium text-gray-600">
                </td>
            </tr>
        </>
    );

    return (
        <div className="mb-6">
            <h2 className="font-semibold text-md mb-3">Rincian Produk</h2>
            <ReusableTable
                columns={columns}
                data={products}
                footer={footerRow}
            />
        </div>
    );
};

const DetailRiwayatOrderLayout = ({ order, titleText, icon }) => {
    if (!order) {
        return <div className="detail-order-error">Order tidak ditemukan.</div>;
    }

    return (
        <div className="detail-order-container">
            <OrderInfoTable order={order} />
            <ProductDetailTable products={order.products} />
        </div>
    );
};

export default DetailRiwayatOrderLayout;
