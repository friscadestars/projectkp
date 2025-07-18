import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../Common/ReusableTable'; // sesuaikan path jika berbeda

const getStatusOrderClass = (status) => {
    switch (status) {
        case 'Disetujui': return 'status-badge status-approved';
        case 'Diproses': return 'status-badge status-processing';
        case 'Ditolak': return 'status-badge status-rejected';
        case 'Dikirim': return 'status-badge status-shipped';
        case 'Diterima':
        case 'Selesai': return 'status-badge status-finished';
        default: return 'status-badge status-default';
    }
};

const getStatusPembayaranClass = (status) => {
    switch (status) {
        case 'Lunas': return 'status-badge payment-lunas';
        case 'Belum Lunas': return 'status-badge payment-belum-lunas';
        default: return 'status-badge payment-unknown';
    }
};

const TagihanTable = ({ orders, searchTerm, role }) => {
    const navigate = useNavigate();

    const filtered = orders
        .filter(order =>
            ['Diproses', 'Dikirim', 'Selesai'].includes(order.status) &&
            (
                order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.distributor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.status.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .sort((a, b) => {
            const orderIdNumA = parseInt(a.orderId?.split('-')[1] || 0);
            const orderIdNumB = parseInt(b.orderId?.split('-')[1] || 0);
            return orderIdNumB - orderIdNumA;
        });

    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1,
            className: 'rounded-tl-md',
        },
        { header: 'Order ID', key: 'orderId' },
        ...(role === 'distributor'
            ? [
                { header: 'Agen ID', key: 'agenId' },
                { header: 'Pabrik ID', key: 'pabrikId' }
            ]
            : [
                { header: 'Distributor', key: 'distributor' }
            ]
        ),
        { header: 'Tanggal Order', key: 'orderDate' },
        {
            header: 'Estimasi Sampai',
            key: 'deliveryEstimate',
            render: (val) => val || '-',
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (val) => <span className={getStatusOrderClass(val)}>{val}</span>,
        },
        {
            header: 'Status Pembayaran',
            key: 'statusPembayaran',
            render: (val) => (
                <span className={getStatusPembayaranClass(val || 'Belum Lunas')}>
                    {val || 'Belum Lunas'}
                </span>
            ),
        },
        {
            header: 'Aksi',
            key: 'aksi',
            className: 'rounded-tr-md',
            render: (_, row) => (
                <button
                    onClick={() => {
                        if (role === 'distributor') {
                            navigate(`/distributor/invoice/${row.orderId}`, {
                                state: { tagihan: row },
                            });
                        } else {
                            navigate('/agen/invoice-tagihan', {
                                state: { tagihan: row, orderId: row.orderId },
                            });
                        }
                    }}
                    className="button-invoice"
                >
                    Invoice
                </button>
            )
        }
    ];

    return (
        <ReusableTable
            columns={columns}
            data={filtered}
            footer={
                <tr>
                    <td
                        colSpan={columns.length}
                        className="px-4 py-3 text-right text-gray-600 font-medium"
                    >
                        Total Tagihan: {filtered.length}
                    </td>
                </tr>
            }
        />
    );
};

export default TagihanTable;
