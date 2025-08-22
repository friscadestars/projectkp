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
        case 'menunggu validasi': // display status
        case 'waiting_confirmation': // raw status
            return 'status-badge payment-menunggu-validasi';
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

const TagihanTable = ({ invoices = [], searchTerm = '', role }) => {
    const navigate = useNavigate();

    const safeInvoices = Array.isArray(invoices) ? invoices : [];

    const filtered = safeInvoices
        .filter(order => {
            const status = (order.status || '').toLowerCase();
            const allowed = ['diproses', 'processing', 'dikirim', 'shipped', 'diterima', 'delivered', 'paid', 'unpaid',];
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
        ...(role === 'distributor'
            ? [
                { header: 'Agen', key: 'agenName' },
                { header: 'Pabrik', key: 'pabrikName' },
            ]
            : [
                { header: 'Distributor', key: 'distributorName' },
            ]),
        {
            header: 'Tanggal Order',
            key: 'orderDate',
            render: (val) => {
                if (!val) return '-';
                const [y, m, d] = val.split('-');
                return `${d}/${m}/${y}`;
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
                let displayStatus = 'Belum Dibayar';
                if (rawStatus === 'paid') displayStatus = 'Lunas';
                else if (rawStatus === 'waiting_confirmation') displayStatus = 'Menunggu Validasi';

                return <span className={getStatusPembayaranClass(displayStatus)}>{displayStatus}</span>;
            },
        },
        {
            header: 'Aksi',
            key: 'aksi',
            className: 'rounded-tr-md',
            render: (_, row) => {
                const tagihanData = {
                    ...row,
                    statusPembayaran: row?.tagihan?.statusPembayaran || row.statusPembayaran || 'Belum Lunas',
                };
                const url = role === 'distributor'
                    ? `/distributor/invoice/${row.orderId}`
                    : `/agen/invoice-tagihan/${row.orderId}`;

                return (
                    <button
                        onClick={() => {
                            navigate(url, {
                                state: { tagihan: tagihanData, orderId: row.orderId },
                            });
                        }}
                        className="button-invoice"
                    >
                        Invoice
                    </button>
                );
            },
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

export default TagihanTable;
