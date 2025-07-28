import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const getStatusPembayaranClass = (status) => {
    switch ((status || '').toLowerCase()) {
        case 'lunas':
            return 'status-badge payment-lunas';
        case 'belum lunas':
            return 'status-badge payment-belum-lunas';
        default:
            return 'status-badge payment-unknown';
    }
};

const TagihanTable = ({ orders, searchTerm, role }) => {
    const navigate = useNavigate();

    const filtered = orders
        .filter(order => {
            const status = (order.status || '').toLowerCase();
            const allowed = ['approved', 'disetujui', 'dikirim', 'shipped', 'selesai', 'received'];
            return allowed.includes(status) && (
                (order.orderCode || order.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.distributorName || order.distributor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                status.includes(searchTerm.toLowerCase())
            );
        })
        .sort((a, b) => {
            const aNum = parseInt(a.orderCode?.split('-')[1] || 0);
            const bNum = parseInt(b.orderCode?.split('-')[1] || 0);
            return bNum - aNum;
        });

    const columns = [
        {
            header: 'No', key: 'no',
            render: (_, __, index) => index + 1,
            className: 'rounded-tl-md'
        },
        {
            header: 'Order ID',
            key: 'orderCode',
            render: (value) => value?.toUpperCase(),
        },
        ...(role === 'distributor'
            ? [
                { header: 'Agen ID', key: 'agentId' },
                { header: 'Pabrik', key: 'pabrikName' }
            ] : [
                { header: 'Distributor', key: 'distributorName' }
            ]),
        {
            header: 'Tanggal Order', key: 'orderDate',
            render: (val) => {
                if (!val) return '-';
                const [y, m, d] = val.split('-');
                return `${d}/${m}/${y}`;
            }
        },
        {
            header: 'Estimasi Sampai', key: 'deliveryDate',
            render: (val) => val || '-'
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (value) => <StatusBadge status={value} />,
        },
        {
            header: 'Status Pembayaran', key: 'statusPembayaran',
            render: (_, row) => {
                const status = row.statusPembayaran || row.tagihan?.statusPembayaran || 'Belum Lunas';
                return <span className={getStatusPembayaranClass(status)}>{status}</span>;
            }
        },
        {
            header: 'Aksi', key: 'aksi', className: 'rounded-tr-md',
            render: (_, row) => (
                <button
                    onClick={() => {
                        const tagihanData = {
                            ...row,
                            statusPembayaran: row.statusPembayaran || row.tagihan?.statusPembayaran || 'Belum Lunas'
                        };
                        const url = role === 'distributor'
                            ? `/distributor/invoice/${row.orderId}`
                            : '/agen/invoice-tagihan';
                        navigate(url, {
                            state: { tagihan: tagihanData, orderId: row.orderId }
                        });
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
