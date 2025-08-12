import React from 'react';
import ReusableTable from '../../Common/ReusableTable';

const TableDaftarOrderMasuk = ({ orders, onDetail }) => {
    const columns = [
        { label: 'No', key: 'no' },
        { label: 'Order ID', key: 'orderId' },
        { label: 'Distributor', key: 'distributorName' },
        { label: 'Agen', key: 'agenName' },
        { label: 'Alamat Agen', key: 'alamat' },
        { label: 'Jumlah', key: 'jumlahProduk' },
        { label: 'Tanggal Order', key: 'orderDate' },
        {
            label: 'Status Order',
            key: 'status',
            render: (value) => {
                let label = value;
                let bgClass = 'bg-gray-400';

                if (value === 'approved') {
                    label = 'Belum Dikirim';
                    bgClass = 'bg-btn-danger';
                } else if (value === 'processing') {
                    label = 'Sedang Diproduksi';
                    bgClass = 'bg-blue-500';
                }

                return (
                    <span className={`${bgClass} text-white px-3 py-1 rounded text-sm`}>
                        {label}
                    </span>
                );
            }
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

    const dataWithIndex = orders.map((order, idx) => ({
        ...order,
        no: idx + 1,
        //jumlahProduk: order.products?.reduce((sum, p) => sum + p.quantity, 0) || 0,
        //products: order.products.length,
        //jumlahProduk: order.products?.length || 0,
        jumlahProduk: order.products?.length || 0, 
    }));

    return (
        <div className="border border-gray-200 shadow overflow-hidden">
            <ReusableTable
                columns={columns}
                data={dataWithIndex}
                className="min-w-full text-sm text-center whitespace-nowrap"
            />
        </div>
    );
};

export default TableDaftarOrderMasuk;