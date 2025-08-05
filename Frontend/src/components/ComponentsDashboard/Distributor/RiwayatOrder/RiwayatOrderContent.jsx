import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const RiwayatOrderContent = ({ entries, onEntriesChange, orders, onDelete, pabrikPrices }) => {
    const navigate = useNavigate();

    const handleDelete = (orderId) => {
        Swal.fire({
            title: 'Yakin ingin menghapus?',
            text: 'Data yang sudah dihapus tidak dapat dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                onDelete(orderId);
                Swal.fire({
                    title: 'Terhapus!',
                    text: 'Riwayat order berhasil dihapus.',
                    icon: 'success',
                    confirmButtonColor: '#2563eb',
                });
            }
        });
    };

    const hitungTotalHargaPabrik = (items, pabrikPrices = []) => {
        if (!items || !Array.isArray(items)) return 0;

        return items.reduce((total, item) => {
            const kode = item.kode_produk;
            const hargaPabrik = pabrikPrices.find(p => p.kode_produk === kode && p.role === 'pabrik');

            const harga = hargaPabrik ? Number(hargaPabrik.harga) : 0;
            const qty = Number(item.quantity) || 0;

            return total + harga * qty;
        }, 0);
    };

    const getStatusPembayaran = (_, row) => {
        const status =
            row.status_pembayaran || // dari backend CI4 snake_case
            row.statusPembayaran || // kemungkinan properti yang udah diubah frontend
            row.invoice_status;

        if (status === 'Lunas') return 'Lunas';
        if (status === 'Belum Dibayar') return 'Belum Dibayar';
        return '-';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        if (isNaN(date)) return '-';

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // bulan dimulai dari 0
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1,
        },
        { header: 'Order ID', key: 'orderCode', render: (value) => value?.toUpperCase(), },
        { header: 'Agen', key: 'agenName' },
        { header: 'Tanggal Order', key: 'orderDate', render: formatDate },
        { header: 'Tanggal Terima', key: 'receivedDate', render: formatDate },
        {
            header: 'Total Harga Pabrik',
            key: 'totalHargaPabrik',
            render: (_, row) => {
                const total = Number(row.totalHargaPabrik) || 0;
                return `Rp ${total.toLocaleString('id-ID')}`;
            }
        },
        {
            header: 'Subtotal Harga Jual',
            key: 'hargaJual',
            render: (val) => `Rp. ${Number(val).toLocaleString('id-ID')}`,
        },
        {
            header: 'Status Pembayaran',
            key: 'status_pembayaran', // <- harus sesuai juga
            render: (_, row) => {
                const status = getStatusPembayaran(_, row);
                return (
                    <span className={`text-white text-sm px-2 py-1 rounded font-bold ${status === 'Lunas' ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                        {status}
                    </span>
                );
            }
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (v) => <StatusBadge status={v} />,
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <div className="flex gap-2 justify-center">
                    <button
                        className="bg-blue-900 text-white px-3 py-1 text-sm rounded font-bold"
                        onClick={() => navigate(`/distributor/detail-riwayat-order/${row.id}`)}
                    >
                        Detail
                    </button>
                    <button
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded font-bold"
                        onClick={() => handleDelete(row.id)}
                    >
                        Hapus
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            {/* Filter Bar */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <input type="date" className="border border-gray-300 rounded px-2 py-1 text-sm" />
                    <span>-</span>
                    <input type="date" className="border border-gray-300 rounded px-2 py-1 text-sm" />
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">Filter</button>
                    <button className="bg-blue-900 text-white px-3 py-1 rounded text-sm font-bold">Export Excel</button>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="entries" className="text-sm">Show</label>
                    <select
                        id="entries"
                        value={entries}
                        onChange={(e) => onEntriesChange(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-sm">entries</span>
                </div>
            </div>

            {/* Table */}
            <div className="mt-4">
                <ReusableTable
                    columns={columns}
                    data={orders}
                    footer={
                        <tr className="px-4 py-3 text-right text-gray-600 font-medium">
                            <td colSpan={columns.length} className="py-2 px-4 text-right">
                                Total Riwayat Order: {orders.length}
                            </td>
                        </tr>
                    }
                />
            </div>
        </div>
    );
};

export default RiwayatOrderContent;
