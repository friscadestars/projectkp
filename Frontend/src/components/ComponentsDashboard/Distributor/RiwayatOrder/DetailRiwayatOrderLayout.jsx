import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')
        }/${d.getFullYear()}`;
};

const OrderInfoTable = ({ order }) => {
    if (!order) return null;

    const columns = [
        { header: 'Order ID', key: 'orderCode', render: (value) => value?.toUpperCase(), },
        { header: 'Agen', key: 'agenName' },
        { header: 'Tanggal Order', key: 'orderDate', render: formatDate },
        { header: 'Tanggal Terima', key: 'receivedDate', render: formatDate },
        {
            header: 'Status Pembayaran',
            key: 'statusPembayaran',
            render: (val) => <StatusBadge status={val} />,
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
        { header: 'Nama Produk', key: 'name' },
        { header: 'Jumlah', key: 'quantity' },
        {
            header: 'Harga Distributor',
            key: 'unitPrice',
            render: (_, row) => {
                const harga = status === 'Tertunda' ? row.requestedPrice : row.unitPrice;
                return typeof harga === 'number'
                    ? `Rp. ${harga.toLocaleString('id-ID')}`
                    : '-';
            }
        },
        { key: 'hargaPabrik', label: 'Harga Pabrik' },
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
        <div className="detail-order-container max-w-screen-2xl w-full mx-auto px-4 sm:px-8 lg:px-8">
            <OrderInfoTable order={order} />
            <ProductDetailTable products={order.products} />
        </div>
    );
};

export default DetailRiwayatOrderLayout;
