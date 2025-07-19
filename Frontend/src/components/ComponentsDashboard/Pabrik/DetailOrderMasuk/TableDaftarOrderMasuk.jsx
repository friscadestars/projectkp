import React from 'react';
import ReusableTable from '../../Common/ReusableTable';

const TableDaftarOrderMasuk = ({ orders, onDetail }) => {
    const columns = [
        { label: 'No', key: 'no' },
        { label: 'Order ID', key: 'orderId' },
        { label: 'Distributor', key: 'distributor' },
        { label: 'Agen ID', key: 'agentId' },
        { label: 'Alamat Agen', key: 'agentAddress' },
        { label: 'Jumlah', key: 'jumlahProduk' },
        { label: 'Tanggal Order', key: 'orderDate' },
        {
            label: 'Status Order',
            key: 'status',
            render: (value) => (
                <span className="bg-btn-danger text-white px-3 py-1 rounded text-xs">
                    {value}
                </span>
            ),
        },
        {
            label: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <button
                    onClick={() => onDetail(row)}
                    className="px-3 py-1 bg-primary-dark text-white rounded hover:bg-primary-darkest"
                >
                    Detail
                </button>
            ),
        },
    ];

    // ✅ Ambil semua order yang statusnya 'Tertunda' (berarti baru dikirim ke pabrik)
    const filteredOrders = orders.filter(order => order.status === 'Tertunda');

    const dataWithIndex = filteredOrders.map((order, idx) => ({
        ...order,
        no: idx + 1,
        jumlahProduk: order.products?.reduce((sum, p) => sum + p.quantity, 0) || 0
    }));

    return (
        <div className="rounded-xl border border-gray-200 shadow overflow-hidden">
            <ReusableTable
                columns={columns}
                data={dataWithIndex}
                className="min-w-full text-sm text-center whitespace-nowrap"
            />
        </div>
    );
};

export default TableDaftarOrderMasuk;
