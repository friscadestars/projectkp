import { useState, useEffect } from "react";
import { useOrder} from "../../Context/OrderContext";
import { useNavigate } from 'react-router-dom';

export const useProduksiPengiriman = () => {
  const { orders, fetchOrders, loading: ordersLoading, error: ordersError } = useOrder();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const getStatusProduksiClass = (status) => {
  //   switch (status) {
  //     case "Sedang Diproduksi": return "bg-blue-500";
  //     case "Selesai Produksi": return "bg-green-500";
  //     default: return "bg-gray-400";
  //   }
  // };

  // const getStatusPengirimanClass = (status) => {
  //   switch (status) {
  //     case "Belum Dikirim": return "bg-red-500";
  //     case "Dikirim": return "bg-blue-500";
  //     case "Diterima": return "bg-green-500";
  //     default: return "bg-gray-400";
  //   }
  // };

  const getStatusPengirimanText = (order) => order.statusPengiriman || "-";

  const isInvoiceEnabled = (order) =>
  order.statusProduksiText?.toLowerCase() === "Selesai Produksi" &&
  order.statusPengirimanText?.toLowerCase() === "Diterima";

  const handleDetail = (order) => {
    navigate('/pabrik/detail-produksi/sedang-produksi', { state: { order } });
  };


  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        if (!orders || orders.length === 0) {
          await fetchOrders();
        }

        const mappedData = (orders || []).map((order, index) => {
          console.log("Order products:", order.products);

          let statusProduksi = "-";
          let statusPengiriman = "Belum Dikirim";

          switch (order.status) {
            case "processing":
              statusProduksi = "processing"; 
              statusPengiriman = "Belum Dikirim"; // ga ada di colorMap, harus tambahin
              break;
            case "shipped":
              statusProduksi = "shipped";   
              statusPengiriman = "shipped"; 
              break;
            case "delivered":
              statusProduksi = "delivered"; 
              statusPengiriman = "delivered";
              break;
            default:
              statusProduksi = "-";
          }

          return {
            no: index + 1,
            id: order.id,
            orderId: order.orderId || "-",
            agentName: order.agenName || "-",
            distributor: order.distributor || "-",
            alamat: order.note || order.alamat || order.address || "-",
            jumlahProduk: order.products?.length || 0,
            products: order.products || [],
            statusProduksi,
            statusPengiriman,
            statusProduksiText: statusProduksi,
            statusPengirimanText: statusPengiriman,
            //statusProduksiClass: getStatusProduksiClass(statusProduksi),
            //statusPengirimanClass: getStatusPengirimanClass(statusPengiriman),
          };
        });

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

  return {
    filteredOrders: data,
    handleDetail,
    getStatusPengirimanText,
    isInvoiceEnabled,
    loading: loading || ordersLoading,
    error: error || ordersError,
  };
};