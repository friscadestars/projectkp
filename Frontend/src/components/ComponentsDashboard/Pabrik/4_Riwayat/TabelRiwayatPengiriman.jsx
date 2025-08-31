import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';
import FilterBarRiwayat from "../../Common/FilterBarRiwayat";
import { useRiwayatPengiriman } from '../../../../hooks/Pabrik/useRiwayatPengiriman';

const DELETED_ORDER_KEY = 'deletedOrders'; // key localStorage

const TabelRiwayatPengiriman = () => {
  const { filteredOrders: initialOrders, formatCurrency } = useRiwayatPengiriman();
  const [entries, setEntries] = useState(10);
  const [deletedOrderIds, setDeletedOrderIds] = useState(() => {
    // Ambil dari localStorage saat pertama kali render
    const stored = localStorage.getItem(DELETED_ORDER_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const navigate = useNavigate();

  // Update localStorage setiap deletedOrderIds berubah
  useEffect(() => {
    localStorage.setItem(DELETED_ORDER_KEY, JSON.stringify(deletedOrderIds));
  }, [deletedOrderIds]);

  const filteredOrders = initialOrders.filter(
    o => !deletedOrderIds.includes(`${o.orderId}-${o.distributorId}`)
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date)) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleExportExcel = () => {
    if (!filteredOrders || filteredOrders.length === 0) return;

    const exportData = filteredOrders.map(order => ({
      'Order ID': order.orderId?.toUpperCase(),
      'Distributor': order.distributor,
      'Tanggal Kirim': order.shippingDate || '-',
      'No. Resi': order.noResi || '-',
      'Total Harga Pabrik': order.totalHarga ? formatCurrency(order.totalHarga) : '-',
      'Status Order': order.status,
      'Tanggal Diterima': order.receivedDate || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Riwayat Pengiriman');
    XLSX.writeFile(wb, 'riwayat_pengiriman.xlsx');
  };

  const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Data yang sudah dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      setDeletedOrderIds(prev => [...prev, `${orderId}-${row.distributorId}`]);
      Swal.fire({
        title: 'Terhapus!',
        text: 'Riwayat order berhasil dihapus dari tampilan.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  const handleFilterDate = (start, end) => {
    setDateFilter({ start, end });
  };

  const [dateFilter, setDateFilter] = useState({ start: null, end: null });

  const displayedOrders = useMemo(() => {
    let data = filteredOrders;

    if (dateFilter.start || dateFilter.end) {
      const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
      const endDate = dateFilter.end ? new Date(dateFilter.end) : null;

      data = data.filter(order => {
        if (!order.deliveryDate) return true; // tampilkan jika deliveryDate null
        const orderDate = new Date(order.deliveryDate);
        if (isNaN(orderDate)) return true; // tampilkan jika invalid date
        if (startDate && orderDate < startDate) return false;
        if (endDate && orderDate > endDate) return false;
        return true;
      });
    }

    return data;
  }, [filteredOrders, dateFilter]);

  const columns = [
    { header: 'No', key: 'no', render: (_, __, index) => index + 1 },
    { header: 'Order ID', key: 'orderCode', render: (value) => value?.toUpperCase() },
    { header: 'Distributor', key: 'distributorName' },
    { header: 'Tanggal Pengiriman', key: 'deliveryDate', render: formatDate },
    { header: 'Tanggal Terima', key: 'receivedDate', render: formatDate },
    { header: 'No. Resi', key: 'trackingNumber' },
    {
      header: 'Total Harga',
      key: 'totalHargaPabrik',
      render: (_, row) => {
        const total = Number(row.totalHargaPabrik) || 0;
        return `Rp ${total.toLocaleString('id-ID')}`;
      }
    },
    { header: 'Status Order', key: 'status', render: v => <StatusBadge status={v} /> },
    {
      header: 'Aksi',
      key: 'aksi',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-900 text-white font-bold px-3 py-1 rounded"
            onClick={() => navigate(`/pabrik/detail-riwayat/${row.orderId}`, { state: { order: row } })}
          >
            Detail
          </button>
          <button
            className="bg-red-600 text-white font-bold px-3 py-1 rounded"
            onClick={() => handleDelete(row.orderId, row.distributorId)}
          >
            Hapus
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <FilterBarRiwayat
        entries={entries}
        onEntriesChange={setEntries}
        onFilterDate={handleFilterDate}
        onExportExcel={handleExportExcel}
      />

      <div className="mt-4">
        <ReusableTable
          columns={columns}
          data={[...displayedOrders]
            .sort((a, b) => new Date(b.receivedDate || 0) - new Date(a.receivedDate || 0))
            .slice(0, entries)
          }
          footer={
            <tr className="px-4 py-3 text-right text-gray-600 font-medium">
              <td colSpan={columns.length} className="py-2 px-4 text-right">
                Total Riwayat Pengiriman: {filteredOrders.length}
              </td>
            </tr>
          }
        />
      </div>
    </div>
  );
};

export default TabelRiwayatPengiriman;
