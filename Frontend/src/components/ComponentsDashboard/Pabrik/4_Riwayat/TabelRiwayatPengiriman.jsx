import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';
import FilterBarRiwayat from '../../Common/FilterBarRiwayat';

const TabelRiwayatPengiriman = ({ entries, onEntriesChange, orders, onDelete, loading }) => {
    const navigate = useNavigate();
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
                    text: 'Riwayat pengiriman berhasil dihapus.',
                    icon: 'success',
                    confirmButtonColor: '#2563eb',
                });
            }
        });
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

    const getStatusPembayaran = (_, row) => {
        const status =
            row.status_pembayaran ||
            row.statusPembayaran ||
            row.invoice_status;

        if (status === 'Lunas') return 'Lunas';
        if (status === 'Belum Dibayar') return 'Belum Dibayar';
        return '-';
    };

    // Fungsi export excel
    const handleExportExcel = () => {
        if (!filteredOrders || filteredOrders.length === 0) {
            Swal.fire('Info', 'Tidak ada data untuk diexport', 'info');
            return;
        }

        const exportData = filteredOrders.map(order => ({
            'Order ID': order.orderCode?.toUpperCase(),
            'Distributor': order.distributorName,
            'Tanggal Kirim': formatDate(order.tanggalKirim),
            'No. Resi': order.trackingNumber || '-',
            'Total Harga Pabrik': order.totalHargaPabrik ? `Rp ${Number(order.totalHargaPabrik).toLocaleString('id-ID')}` : '-',
            'Status Order': order.status,
            'Status Pembayaran': getStatusPembayaran(null, order),
            'Tanggal Pembayaran': formatDate(order.tanggalPembayaran),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'RiwayatPengiriman');
        XLSX.writeFile(workbook, 'riwayat_pengiriman.xlsx');
    };

    const columns = [
        { header: 'No', key: 'no', render: (_, __, index) => index + 1 },
        { header: 'Order ID', key: 'orderCode', render: (value) => value?.toUpperCase() },
        { header: 'Distributor', key: 'distributorName' },
        { header: 'Tanggal Kirim', key: 'tanggalKirim', render: formatDate },
        { header: 'No. Resi', key: 'trackingNumber', render: (val) => val || '-' },
        {
            header: 'Total Harga Pabrik',
            key: 'totalHargaPabrik',
            render: (_, row) => {
                const total = Number(row.totalHargaPabrik) || 0;
                return `Rp ${total.toLocaleString('id-ID')}`;
            }
        },
        { header: 'Status Order', key: 'status', render: (v) => <StatusBadge status={v} /> },
        {
          header: 'Status Pembayaran',
          key: 'status_pembayaran',
          render: (_, row) => {
            const status = getStatusPembayaran(_, row);
              return  (
                <div className="flex justify-center"> {/* <-- tambah flex */}
                  <span
                    className={`text-white text-sm px-2 py-1 rounded font-bold ${
                      status === 'Lunas' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {status}
                  </span>
                </div>
            );
          }
        },
        { header: 'Tanggal Pembayaran', key: 'tanggalPembayaran', render: formatDate },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <div className="flex gap-2 justify-center">
                    <button
                        className="bg-blue-900 text-white px-3 py-1 text-sm rounded font-bold"
                        onClick={() => navigate(`/pabrik/detail-riwayat/${row.id}`)}
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
                onFilterDate={() => {}}
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
                                    Total Riwayat Pengiriman: {filteredOrders.length}
                                </td>
                            </tr>
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default TabelRiwayatPengiriman;
