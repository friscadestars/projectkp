// // src/hooks/Pabrik/useProduksiPengiriman.js

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useOrderPabrik } from '../../Context/OrderContextPabrik';
// import { pabrikMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
// import { useNavigation } from '../useNavigation';

// const useProduksiPengiriman = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const { orders } = useOrderPabrik();
//   const navigate = useNavigate();
//   const { handleNavigation } = useNavigation(pabrikMenuItems);

//   const handleDetail = (order) => {
//     let path = '';

//     if (order.status === 'Sedang Diproduksi') {
//       path = '/pabrik/detail-produksi/sedang-produksi';
//     } else if (order.status === 'Selesai Produksi') {
//       path = '/pabrik/detail-produksi/selesai-produksi';
//     } else if (order.status === 'Dikirim') {
//       path = '/pabrik/detail-produksi/dikirim';
//     }

//     navigate(path, { state: { order } });
//   };

//   const getStatusProduksiClass = (status) => {
//     switch (status) {
//       case 'Sedang Diproduksi':
//         return 'bg-btn-primary';
//       case 'Selesai Produksi':
//         return 'bg-btn-success';
//       case 'Diterima':
//         return 'bg-btn-confirm';
//       default:
//         return 'bg-gray-400';
//     }
//   };

//   // const getStatusPengirimanText = (order) => {
//   //   if (order.status === 'Diterima') return 'Diterima';
//   //   if (order.status === 'Selesai Produksi') return 'Dikirim';
//   //   return 'Belum Dikirim';
//   // };

//   // Disini
//   const getStatusPengirimanText = (order) => {
//       if (order.status === 'Sedang Diproduksi') return 'Belum Dikirim';
//       if (order.statusPengiriman) return order.statusPengiriman; // kalau API sudah ada field ini
//       if (order.status === 'Selesai Produksi') return 'Dikirim';
//       if (order.status === 'Diterima') return 'Diterima';
//       return 'Belum Dikirim';
//   };

//   const getStatusPengirimanClass = (order) => {
//     const status = getStatusPengirimanText(order);
//     switch (status) {
//       case 'Dikirim':
//         return 'bg-btn-info';
//       case 'Diterima':
//         return 'bg-btn-success';
//       default:
//         return 'bg-btn-danger';
//     }
//   };

//   // const isInvoiceEnabled = (order) => {
//   //   const pengirimanStatus = getStatusPengirimanText(order);
//   //   return pengirimanStatus === 'Dikirim' || pengirimanStatus === 'Diterima';
//   // };

//   // Disini
//   const isInvoiceEnabled = (order) => {
//     return order.status === 'Selesai Produksi' || order.status === 'Diterima';  
//   };

//   const filteredOrders = orders
//     .filter(order =>
//       ['Sedang Diproduksi', 'Selesai Produksi', 'Diterima'].includes(order.status)
//     )
//     .filter(order =>
//       order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.agentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.distributor?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   return {
//     searchTerm,
//     setSearchTerm,
//     filteredOrders,
//     handleNavigation,
//     handleDetail,
//     getStatusProduksiClass,
//     getStatusPengirimanClass,
//     getStatusPengirimanText,
//     isInvoiceEnabled,
//   };
// };

// export { useProduksiPengiriman };


// ====================== src/hooks/Pabrik/useProduksiPengiriman.js ======================

// import { useOrder } from '../../Context/OrderContext';

// export const useProduksiPengiriman = () => {
//   const { orders, loading, error } = useOrder(); // Pastikan Context kirim ini

//   const parseDate = (dateString) => {
//     if (!dateString) return new Date(0);
//     const [day, month, year] = dateString.split('/').map(Number);
//     return new Date(year, month - 1, day);
//   };

//   const statusMap = {
//     processing: 'Sedang Diproduksi',
//     shipped: 'Dikirim',
//   };

//   const produksiOrders = orders.filter(order => order.status === 'processing');
//   const pengirimanOrders = orders.filter(order => order.status === 'shipped');

//   const combinedOrders = [...produksiOrders, ...pengirimanOrders].sort(
//     (a, b) => parseDate(b.orderDate) - parseDate(a.orderDate)
//   );

//   return {
//     data: combinedOrders,  // ini yang dibaca tabel
//     loading,
//     error,
//     statusMap
//   };
// };


// src/hooks/ProduksiPengiriman/useProduksiPengiriman.js
// src/hooks/ProduksiPengiriman/useProduksiPengiriman.js
import { useState, useEffect } from "react";
import { useOrder } from "../../context/OrderContext";

export const useProduksiPengiriman = () => {
  const { orders, fetchOrders, loading: ordersLoading, error: ordersError } = useOrder();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        if (!orders || orders.length === 0) {
          await fetchOrders();
        }

        const mappedData = (orders || []).map(order => ({
          id: order.id,
          orderId: order.orderId,
          agentName: order.agenName || "-",       
          distributor: order.distributor || "-",  
          alamat: order.address || "-",
          jumlahProduk: order.products?.length || 0,
          products: order.products || [],
          statusProduksi: order.statusProduksi || "-",     
          statusPengiriman: order.statusPengiriman || "-", 
        }));

        setData(mappedData);
      } catch (err) {
        console.error("[useProduksiPengiriman] fetch error:", err);
        setError("Gagal memuat data Produksi & Pengiriman");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [orders, fetchOrders]);

  // ==== Fungsi tambahan untuk tabel ====
  const filteredOrders = data;

  const handleDetail = (order) => {
    console.log("Detail order:", order);
    // Bisa tambahkan navigasi ke halaman detail
  };

  const getStatusProduksiClass = (status) => {
    switch (status) {
      case "Sedang Diproduksi": return "bg-blue-500";
      case "Selesai Produksi": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  const getStatusPengirimanClass = (order) => {
    switch (order.statusPengiriman) {
      case "Belum Dikirim": return "bg-red-500";
      case "Dikirim": return "bg-blue-500";
      case "Diterima": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  const getStatusPengirimanText = (order) => order.statusPengiriman || "-";

  const isInvoiceEnabled = (order) =>
    order.statusProduksi === "Selesai Produksi" &&
    order.statusPengiriman === "Diterima";

  return {
    filteredOrders,
    handleDetail,
    getStatusProduksiClass,
    getStatusPengirimanClass,
    getStatusPengirimanText,
    isInvoiceEnabled,
    loading: loading || ordersLoading,
    error: error || ordersError,
  };
};
