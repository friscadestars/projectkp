import { useState, useEffect } from "react";
import { useOrder } from "../../Context/OrderContext";
import { useNavigate } from 'react-router-dom';

export const useProduksiPengiriman = () => {
  const { orders, fetchOrders, loading: ordersLoading, error: ordersError } = useOrder();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getStatusPengirimanText = (order) => order.statusPengirimanText || "-";

  const isInvoiceEnabled = (order) =>
    order.statusProduksiText?.toLowerCase() === "selesai produksi" 

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
          let statusProduksi = "-";       // untuk StatusBadge (warna)
          let statusProduksiText = "-";   // untuk teks di detail
          let statusPengiriman = "Belum Dikirim";

          // switch (order.status) {
          //   case "processing":
          //     statusProduksi = "processing";       // warna biru
          //     statusProduksiText = "Sedang Diproduksi";
          //     statusPengiriman = "Belum Dikirim";
          //     break;
          //   case "shipped":
          //     statusProduksi = "shipped";          // warna hijau/biru sesuai mapping
          //     statusProduksiText = "Selesai Produksi";
          //     statusPengiriman = "Dikirim";
          //     break;
          //   case "delivered":
          //     statusProduksi = "delivered";        // warna hijau
          //     statusProduksiText = "Selesai Produksi";
          //     statusPengiriman = "Diterima";
          //     break;
          //   default:
          //     statusProduksi = "-";
          //     statusProduksiText = "-";
          // }

          switch (order.status) {
  case "processing":
    statusProduksi = "processing";
    statusProduksiText = "Sedang Diproduksi";
    statusPengiriman = "Belum Dikirim";
    break;

  case "shipped":
    if (order.overrideForUI && order.statusPengiriman === "Belum Dikirim") {
      // Override → tampil Selesai Produksi, Belum Dikirim
      statusProduksi = "processing"; // pakai warna biru dari badge
      statusProduksiText = order.statusProduksiText || "Selesai Produksi";
      statusPengiriman = "Belum Dikirim";
    } else {
      // Normal → Selesai Produksi, Dikirim
      statusProduksi = "shipped";
      statusProduksiText = "Selesai Produksi";
      statusPengiriman = "Dikirim";
    }
    break;

  case "delivered":
    statusProduksi = "delivered";
    statusProduksiText = "Selesai Produksi";
    statusPengiriman = "Diterima";
    break;

  default:
    statusProduksi = "-";
    statusProduksiText = "-";
}


          return {
            no: index + 1,
            id: order.id,
            orderId: order.orderId || "-",
            agentName: order.agenName || "-",
            distributor: order.distributor || "-",
            alamat: order.note || order.alamat || order.address || "-",
            jumlahProduk: order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0,
            products: order.products || [],
            statusProduksi,          // original status untuk warna badge
            statusProduksiText,      // teks rapi untuk detail
            statusPengiriman,
            statusPengirimanText: statusPengiriman,
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
