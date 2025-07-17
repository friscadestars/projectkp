// src/hooks/Pabrik/useProduksiPengiriman.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderPabrik } from '../../Context/OrderContextPabrik';
import { pabrikMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../useNavigation';

const useProduksiPengiriman = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { orders } = useOrderPabrik();
  const navigate = useNavigate();
  const { handleNavigation } = useNavigation(pabrikMenuItems);

  const handleDetail = (order) => {
    let path = '';

    if (order.status === 'Sedang Diproduksi') {
      path = '/pabrik/detail-produksi/sedang-produksi';
    } else if (order.status === 'Selesai Produksi') {
      path = '/pabrik/detail-produksi/selesai-produksi';
    } else if (order.status === 'Dikirim') {
      path = '/pabrik/detail-produksi/dikirim';
    }

    navigate(path, { state: { order } });
  };

  const getStatusProduksiClass = (status) => {
    switch (status) {
      case 'Sedang Diproduksi':
        return 'bg-btn-primary';
      case 'Selesai Produksi':
        return 'bg-btn-success';
      case 'Diterima':
        return 'bg-btn-confirm';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusPengirimanText = (order) => {
    if (order.status === 'Diterima') return 'Diterima';
    if (order.status === 'Selesai Produksi') return 'Dikirim';
    return 'Belum Dikirim';
  };

  const getStatusPengirimanClass = (order) => {
    const status = getStatusPengirimanText(order);
    switch (status) {
      case 'Dikirim':
        return 'bg-btn-info';
      case 'Diterima':
        return 'bg-btn-success';
      default:
        return 'bg-btn-danger';
    }
  };

  const isInvoiceEnabled = (order) => {
    const pengirimanStatus = getStatusPengirimanText(order);
    return pengirimanStatus === 'Dikirim' || pengirimanStatus === 'Diterima';
  };

  const filteredOrders = orders
    .filter(order =>
      ['Sedang Diproduksi', 'Selesai Produksi', 'Diterima'].includes(order.status)
    )
    .filter(order =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.agentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.distributor?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return {
    searchTerm,
    setSearchTerm,
    filteredOrders,
    handleNavigation,
    handleDetail,
    getStatusProduksiClass,
    getStatusPengirimanClass,
    getStatusPengirimanText,
    isInvoiceEnabled,
  };
};

export { useProduksiPengiriman };
