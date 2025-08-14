import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { fetchCompletedOrdersForHistory } from '../../services/ordersApi';

export const useRiwayatPengiriman = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchCompletedOrdersForHistory('pabrik');
        console.log('RAW DATA FROM API:', data);
        setOrders(data);
      } catch (err) {
        console.error('Gagal fetch orders:', err);
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(
    o => (o.status || '').toLowerCase() === 'delivered' &&
      ((o.orderId || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.distributorName || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);

  const handleExportExcel = () => {
    if (filteredOrders.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(filteredOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Riwayat Pengiriman');
    XLSX.writeFile(wb, 'riwayat_pengiriman.xlsx');
  };

  return { filteredOrders, searchTerm, setSearchTerm, handleExportExcel, formatCurrency };
};
