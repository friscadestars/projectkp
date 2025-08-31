import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';
import FilterBarRiwayat from '../../Common/FilterBarRiwayat';

const RiwayatOrderContent = ({ entries, onEntriesChange, orders, onDelete, pabrikPrices, loading }) => {
    const navigate = useNavigate();

    // Optional: simpan data filtered untuk export jika ada filter
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders]);

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

    const getStatusPembayaran = (_, row) => {
        const status =
            row.status_pembayaran ||
            row.statusPembayaran ||
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
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    // Fungsi export excel
    const handleExportExcel = () => {
        if (!filteredOrders || filteredOrders.length === 0) {
            Swal.fire('Info', 'Tidak ada data untuk diexport', 'info');
            return;
        }

        // Map data ke format yang diinginkan
        const exportData = filteredOrders.map(order => ({
            'Order ID': order.orderCode?.toUpperCase(),
            'Agen': order.agenName,
            'Tanggal Order': formatDate(order.orderDate),
            'Tanggal Terima': formatDate(order.receivedDate),
            'Total Harga Pabrik': order.totalHargaPabrik ? `Rp ${Number(order.totalHargaPabrik).toLocaleString('id-ID')}` : '-',
            'Total Harga Jual': order.hargaJual ? `Rp ${Number(order.hargaJual).toLocaleString('id-ID')}` : '-',
            'Status Pembayaran': getStatusPembayaran(null, order),
            'Status Order': order.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'RiwayatOrder');
        XLSX.writeFile(workbook, 'riwayat_order.xlsx');
    };

    const handleFilterDate = (start, end) => {
        if (!start && !end) {
            setFilteredOrders(orders);
            return;
        }

        const startDate = start ? new Date(start) : null;
        const endDate = end ? new Date(end) : null;

        const filtered = orders.filter(order => {
            const orderDate = new Date(order.orderDate);
            if (isNaN(orderDate)) return false;

            if (startDate && orderDate < startDate) return false;
            if (endDate && orderDate > endDate) return false;

            return true;
        });

        setFilteredOrders(filtered);
    };

    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1,
        },
        { header: 'Order ID', key: 'orderCode', render: (value) => value?.toUpperCase() },
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
            header: 'Total Harga Jual',
            key: 'hargaJual',
            render: (val) => `Rp. ${Number(val).toLocaleString('id-ID')}`,
        },
        {
            header: 'Status Pembayaran',
            key: 'status_pembayaran',
            render: (_, row) => {
                const status = getStatusPembayaran(_, row);
                return (
                    <div className="flex justify-center"> {/* <-- tambah flex untuk background full*/}
                        <span className={`text-white text-sm px-2 py-1 rounded font-bold ${status === 'Lunas' ? 'bg-green-600' : 'bg-red-600'}`}>
                            {status}
                        </span>
                    </div>
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
            <FilterBarRiwayat
                entries={entries}
                onEntriesChange={onEntriesChange}
                onFilterDate={handleFilterDate}
                onExportExcel={handleExportExcel}
            />

            <div className="mt-4">
                {loading ? (
                    <p className="text-center text-gray-500 text-sm">Memuat data...</p>
                ) : (
                    <ReusableTable
                        columns={columns}
                        data={filteredOrders}
                        footer={
                            <tr className="px-4 py-3 text-right text-gray-600 font-medium">
                                <td colSpan={columns.length} className="py-2 px-4 text-right">
                                    Total Riwayat Order: {filteredOrders.length}
                                </td>
                            </tr>
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default RiwayatOrderContent;
