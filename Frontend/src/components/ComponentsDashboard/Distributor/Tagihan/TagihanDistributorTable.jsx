import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const getStatusPembayaranClass = (status) => {
    switch ((status || '').toLowerCase()) {
        case 'lunas':
            return 'status-badge payment-lunas';
        case 'belum dibayar':
            return 'status-badge payment-belum-lunas';
        default:
            return 'status-badge payment-unknown';
    }
};

const formatDate = (value) => {
    if (!value || value === 'Invalid Date') return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const TagihanDistributorTable = ({ orders = [], searchTerm = '' }) => {
    console.log("Orders received:", orders);
    const navigate = useNavigate();

    const allowed = ['approved', 'disetujui', 'dikirim', 'shipped', 'selesai', 'delivered'];

    const filtered = orders.filter(order => {
        const status = (order.status || '').toLowerCase();
        return allowed.includes(status) && (
            (order.orderCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.agenName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1,
            className: 'rounded-tl-md',
        },
        {
            header: 'Order ID',
            key: 'orderCode',
            render: (value) => value?.toUpperCase(),
        },
        { header: 'Agen', key: 'agenName' },
        { header: 'Pabrik', key: 'pabrikName' },
        {
            header: 'Tanggal Order',
            key: 'order_date',
            render: (val) => {
                if (!val) return '-';
                const date = new Date(val);
                return new Intl.DateTimeFormat('id-ID', {
                    day: '2-digit',
                    month: 'numeric',
                    year: 'numeric'
                }).format(date);
            },
        },
        {
            header: 'Tanggal Terima',
            key: 'receivedDate',
            render: formatDate,
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (value) => <StatusBadge status={value} />,
        },
        {
            header: 'Status Pembayaran',
            key: 'statusPembayaran',
            render: (_, row) => {
                const rawStatus = row?.tagihan?.statusPembayaran || row.statusPembayaran || 'unpaid';
                const displayStatus = rawStatus === 'paid' ? 'Lunas' : 'Belum Dibayar';
                return <span className={getStatusPembayaranClass(displayStatus)}>{displayStatus}</span>;
            },
        },
        {
            header: 'Aksi',
            key: 'aksi',
            className: 'rounded-tr-md',
            render: (_, row) => {
                const tagihanData = {
                    id: row.id, // penting
                    invoice_number: row.invoice_number,
                    invoice_date: row.invoice_date,
                    due_date: row.due_date,
                    amount_total: row.amount_total,
                    distributor_id: row.distributor_id,
                    pabrik_id: row.pabrik_id,
                    status: row.status,
                    items: row.items || [], // pastikan ada
                };

                const url = `/distributor/invoice/${row.orderId || row.order_id}`;

                return (
                    <button
                        onClick={() =>
                            navigate(url, {
                                state: {
                                    tagihan: tagihanData,
                                    orderId: row.orderId || row.order_id
                                }
                            })
                        }
                        className="button-invoice"
                    >
                        Invoice
                    </button>
                );
            }

        },
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

export default TagihanDistributorTable;
