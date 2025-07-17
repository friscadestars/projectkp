import { useState } from 'react';
import { useOrderPabrik } from '../../Context/OrderContextPabrik';
import * as XLSX from 'xlsx';

export const useRiwayatPengiriman = () => {
  const { orders } = useOrderPabrik();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(
    (order) =>
      order.status === 'Dikirim' || order.status === 'Diterima'
  ).filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.distributor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Riwayat Pengiriman');
    XLSX.writeFile(wb, 'riwayat_pengiriman.xlsx');
  };

  return {
    filteredOrders,
    searchTerm,
    setSearchTerm,
    handleExportExcel,
    formatCurrency,
  };
};
