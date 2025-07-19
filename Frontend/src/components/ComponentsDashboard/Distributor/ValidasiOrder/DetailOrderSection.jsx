import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge'; 

const DetailOrderSection = ({ order, inputPrices, handleSetHarga, handleTerima, handleTolak }) => {
    if (!order) return <p className="text-gray-500 italic">Data order tidak tersedia</p>;

    // === Order Info Table Columns ===
    const orderColumns = [
        { header: 'Order ID', key: 'orderId' },
        {
            header: 'Agen ID',
            key: 'agenId',
            render: () => 'AG-001', 
        },
        {
            header: 'Alamat',
            key: 'alamat',
            render: () => 'Jl. Melati no.20 Jakarta', 
        },
        { header: 'Tanggal Order', key: 'orderDate' },
        {
            header: 'Jumlah Produk',
            key: 'products',
            render: (products) =>
                Array.isArray(products)
                    ? products.reduce((sum, p) => sum + p.quantity, 0)
                    : 0,
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (status) => <StatusBadge status={status} />,
        },
    ];

    // === Produk Detail Columns ===
    const produkColumns = [
        { header: 'Nama Produk', key: 'name' },
        { header: 'Jumlah', key: 'quantity' },
        {
            header: 'Harga Agen',
            key: 'requestedPrice',
            render: (val) => `Rp ${val.toLocaleString('id-ID')}`,
        },
        {
            header: 'Harga Pabrik',
            key: 'unitPrice',
            render: (val) => `Rp ${val > 0 ? val.toLocaleString('id-ID') : '0'}`,
        },
        {
            header: 'Set Harga',
            key: 'setHarga',
            render: (_, row, index) => (
                <input
                    type="text"
                    placeholder="Rp"
                    value={inputPrices[index]?.price}
                    onChange={(e) => handleSetHarga(index, e.target.value)}
                    className="border rounded px-2 py-1 w-28 text-sm"
                />
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Order Info */}
            <div>
                <h2 className="font-semibold text-md mb-2">Detail Order</h2>
                <ReusableTable
                    columns={orderColumns}
                    data={[order]}
                    footer={
                        <tr>
                            <td
                                colSpan={orderColumns.length}
                                className="border-t border-gray-300 px-4 py-2 text-right text-sm text-gray-500"
                            ></td>
                        </tr>
                    }
                />
            </div>

            {/* Produk Detail */}
            <div>
                <h2 className="font-semibold text-md mb-2">Rincian Produk</h2>
                <ReusableTable
                    columns={produkColumns}
                    data={order.products}
                    footer={
                        <tr>
                            <td
                                colSpan={produkColumns.length}
                                className="border-t border-gray-300 text-right px-4 py-2 text-sm text-gray-600"
                            ></td>
                        </tr>
                    }
                />
            </div>

        </div>
    );
};

export default DetailOrderSection;
