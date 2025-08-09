import React from 'react';
import ReusableTable from '../../../Common/ReusableTable'; // Sesuaikan path jika perlu
import StatusBadge from '../../../Common/StatusBadge';

const formatDate = (val) => {
    if (!val) return '-';
    const date = new Date(val);
    if (isNaN(date.getTime())) return '-'; // jika bukan tanggal valid
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const OrderDetailTable = ({ order }) => {
    if (!order) return <p className="text-gray-500 italic">Data order tidak tersedia.</p>;

    const columns = [
        {
            header: 'Order ID',
            key: 'orderCode',
            render: (val) => (val || '').toUpperCase(),
        },
        {
            header: 'Agen',
            key: 'agenName',
            render: (val) => val || 'Nama tidak ditemukan',
        },
        {
            header: 'Pabrik',
            key: 'pabrikName',
            render: (val) => val || 'Tidak diketahui',
        },
        {
            header: 'Tanggal Order',
            key: 'orderDate',
            render: (val) => {
                if (!val) return '-';
                const date = new Date(val);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
        },
        {
            header: 'Tanggal Pengiriman',
            key: 'deliveryDate',
            render: formatDate,
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (status) => <StatusBadge status={status} />,
        },
    ];

    return (
        <>
            <h2 className="font-semibold text-md mb-2">Detail Order</h2>
            <ReusableTable
                columns={columns}
                data={[order]}
                footer={<tr><td colSpan={columns.length}></td></tr>}
            />
        </>
    );
};

const ProductSummaryTable = ({ products }) => {
    const data = products.map((p) => ({
        ...p,
        subtotal: p.unitPrice * p.quantity,
    }));

    const total = data.reduce((sum, p) => sum + p.subtotal, 0);

    const columns = [
        { header: 'Nama Produk', key: 'name' },
        { header: 'Jumlah', key: 'quantity' },
        {
            header: 'Harga Jual',
            key: 'unitPrice',
            render: (val) => `Rp. ${(val ?? 0).toLocaleString('id-ID')}`,
        },
        {
            header: 'Subtotal',
            key: 'subtotal',
            render: (val) => `Rp. ${(val ?? 0).toLocaleString('id-ID')}`,
        },
    ];

    return (
        <>
            <h2 className="font-semibold text-md mb-2">Rincian Produk</h2>
            <ReusableTable
                columns={columns}
                data={data}
                footer={
                    <tr className="bg-gray-200 border-t border-gray-300 font-semibold text-sm">
                        <td colSpan="3" className="py-2 px-4 text-left">Total</td>
                        <td className="py-2 px-4">Rp. {total.toLocaleString('id-ID')}</td>
                    </tr>
                }
            />
        </>
    );
};

const DetailOrderContent = ({ order, titleText, icon }) => {
    if (!order) {
        return <div className="detail-order-error">Order tidak ditemukan.</div>;
    }
    const products = order.products ?? [];

    console.log('Produk dari order.products:', products);

    return (
        <div className="p-1">
            <div className="detail-order-header flex items-center gap-2 mb-4">
                {icon && <img src={icon} alt="Icon" className="detail-order-icon w-10 h-10" />}
                <h1 className="detail-order-title text-lg font-semibold">{titleText}</h1>
            </div>

            <div className="detail-order-container max-w-screen-2xl w-full mx-auto px-4 sm:px-8 lg:px-8">
                <OrderDetailTable order={order} />
                <ProductSummaryTable products={products} />
            </div>
        </div>
    );
};

export default DetailOrderContent;
