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

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const safeDateStr = dateStr.replace(' ', 'T');
    const date = new Date(safeDateStr);
    if (isNaN(date)) return '-';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const TagihanDistributorTable = ({ orders = [], searchTerm = '', loading = false }) => {
    const navigate = useNavigate();

    const allowed = ['approved', 'disetujui', 'dikirim', 'shipped', 'selesai', 'delivered'];

    const filtered = orders.filter(order => {
        const orderStatus = (order.order_status || '').toLowerCase();

        return allowed.includes(orderStatus) && (
            (order.orderCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.agenName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            orderStatus.includes(searchTerm.toLowerCase())
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
            render: formatDate,
        },
        {
            header: 'Tanggal Terima',
            key: 'receivedDate',
            render: formatDate,
        },
        {
            header: 'Status Order',
            key: 'order_status',
            render: (value) => <StatusBadge status={value} />,
        },
        {
            header: 'Status Pembayaran',
            key: 'statusPembayaran',
            render: (_, row) => {
                const displayStatus = row.statusPembayaran || 'Belum Dibayar';
                return <span className={getStatusPembayaranClass(displayStatus)}>{displayStatus}</span>;
            },
        },
        {
            header: 'Aksi',
            key: 'aksi',
            className: 'rounded-tr-md',
            render: (_, row) => {
                const tagihanData = {
                    id: row.id,
                    invoice_number: row.invoice_number,
                    invoice_date: row.invoice_date,
                    due_date: row.due_date,
                    amount_total: row.amount_total,
                    distributor_id: row.distributor_id,
                    pabrik_id: row.pabrik_id,
                    status: row.status,
                    items: row.items || [],
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
        <>
            {loading ? (
                <p className="text-center text-sm text-gray-500 py-4">Memuat data...</p>
            ) : (
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
            )}
        </>
    );
};

export default TagihanDistributorTable;
