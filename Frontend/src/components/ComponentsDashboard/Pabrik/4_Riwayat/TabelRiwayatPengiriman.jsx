import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';
import FilterBarRiwayat from "../../Common/FilterBarRiwayat";
import { useRiwayatPengiriman } from '../../../../hooks/Pabrik/useRiwayatPengiriman';

const TabelRiwayatPengiriman = () => {
  const {
    filteredOrders,
    formatCurrency,
  } = useRiwayatPengiriman();

  const [entries, setEntries] = useState(10);
  const navigate = useNavigate();

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

  const columns = [
    { header: 'No', key: 'no', render: (_, __, index) => index + 1 },
    { header: 'Order ID', key: 'orderCode', render: (value) => value?.toUpperCase() },
    { header: 'Distributor', key: 'distributorName' },
    { header: 'Tanggal Terima', key: 'deliveryDate', render: formatDate },
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
    { header: 'Tanggal Terima', key: 'receivedDate', render: formatDate },
    {
      header: 'Aksi', key: 'aksi', render: (_, row) => (
        <button
          className="bg-blue-900 text-white px-3 py-1 rounded"
          onClick={() => navigate('/pabrik/detail-riwayat', { state: { order: row } })}
        >
          Detail
        </button>
      )
    }
  ];

  return (
    <div>
      <FilterBarRiwayat
        entries={entries}
        onEntriesChange={setEntries}
        onExportExcel={handleExportExcel}
      />

      <div className="mt-4">
        <ReusableTable
          columns={columns}
          data={filteredOrders.slice(0, entries)}
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
