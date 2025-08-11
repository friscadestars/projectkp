import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';


function formatRupiah(value) {
    let number = Number(value);
    if (isNaN(number) || number <= 0) return 'Rp 0';
    if (number > 1000000) {
        number = number / 100;
    }
    return 'Rp ' + number.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

const DetailOrderSection = ({ order, inputPrices, handleSetHarga, handleTerima, handleTolak }) => {
    if (!order) return <p className="text-gray-500 italic">Data order tidak tersedia</p>;

    // === Order Info Table Columns ===
    const orderColumns = [
        {
            header: 'Order ID', key: 'orderCode',
            render: (val) => (val || '').toUpperCase()
        },
        {
            header: 'Agen',
            key: 'agenId',
        },
        {
            header: 'Alamat',
            key: 'alamat',
        },
        {
            header: 'Tanggal Order',
            key: 'orderDate',
            render: (val) =>
                new Date(val).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }),
        },
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
            render: (val) => formatRupiah(val),
        },
        {
            header: 'Harga Pabrik',
            key: 'unitPrice',
            render: (val) => {
                const num = Number(val);
                if (isNaN(num) || num <= 0) return 'Rp 0';
                return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            },
        },
        {
            header: 'Set Harga',
            key: 'setHarga',
            render: (_, row, index) => {
                const rawValue = inputPrices[index]?.price || '';
                const formattedValue = formatRupiah(rawValue);

                const handleChange = (e) => {
                    const input = e.target.value;
                    const numberValue = Number(input.replace(/[^0-9]/g, '')) || 0;
                    handleSetHarga(index, numberValue);
                };

                return (
                    <input
                        type="text"
                        placeholder="Rp"
                        value={formattedValue}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-28 text-sm"
                    />
                );
            },
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
