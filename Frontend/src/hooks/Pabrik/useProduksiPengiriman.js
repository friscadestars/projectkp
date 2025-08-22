import { useState, useEffect } from "react";
import { useOrder } from "../../Context/OrderContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const useProduksiPengiriman = () => {
  const { orders, fetchOrders, loading: ordersLoading, error: ordersError } = useOrder();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load invoice status from localStorage first
  const savedInvoiceStatus = JSON.parse(localStorage.getItem("invoiceStatus") || "{}");
  const [invoiceStatus, setInvoiceStatus] = useState(savedInvoiceStatus);

  const getStatusPengirimanText = (order) => order.statusPengirimanText || "-";

  const isInvoiceEnabled = (order) => {
    const produksi = order.statusProduksiText?.toLowerCase();
    const pengiriman = order.statusPengirimanText?.toLowerCase();

    return produksi === "selesai produksi" || pengiriman === "dikirim";
  };

  const handleDetail = (order) => {
    navigate("/pabrik/detail-produksi/sedang-produksi", { state: { order } });
  };

  // Load orders dan mapping data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        if (!orders || orders.length === 0) {
          await fetchOrders();
        }

        const mappedData = (orders || []).map((order, index) => {
          let statusProduksi = "-";
          let statusProduksiText = "-";
          let statusPengiriman = "Belum Dikirim";

          switch (order.status) {
            case "processing":
              statusProduksi = "processing";
              statusProduksiText = "Sedang Diproduksi";
              statusPengiriman = "Belum Dikirim";
              break;
            case "produced":
              statusProduksi = "produced";
              statusProduksiText = "Selesai Produksi";
              statusPengiriman = "Belum Dikirim";
              break;
            case "shipped":
              statusProduksi = "shipped";
              statusProduksiText = "Dikirim";
              statusPengiriman = "Dikirim";
              break;
            case "delivered":
              statusProduksi = "delivered";
              statusProduksiText = "Diterima";
              statusPengiriman = "Diterima";
              break;
          }

          return {
            no: index + 1,
            id: Number(order.id),
            orderId: order.orderId || "-",
            agentName: order.agenName || "-",
            distributor: order.distributor || "-",
            agen_id: Number(
              order.agen_id ||
              order.agenId ||
              order.agent_id ||
              order.agentId ||
              order.products?.[0]?.agen_id ||
              order.products?.[0]?.agent_id ||
              0
            ),
            distributor_id: Number(
              order.distributor_id ||
              order.distributorId ||
              order.products?.[0]?.distributor_id ||
              order.products?.[0]?.distributorId ||
              0
            ),
            alamat: order.note || order.alamat || order.address || "-",
            jumlahProduk:
              order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0,
            products: (order.products || []).map((p) => ({
              ...p,
              quantity: Number(p.quantity || 0),
              unitPrice: Number(
                p.unitPrice || p.price || p.harga_satuan || p.harga_pabrik || 0
              ),
            })),
            statusProduksi,
            statusProduksiText,
            statusPengiriman,
            statusPengirimanText: statusPengiriman,
            pabrikName: order.pabrikName || order.pabrik_name || "-",
            pabrikId: Number(order.pabrikId || order.pabrik_id || 1),
            orderDate: order.orderDate || order.order_date || null,
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

  // Fetch invoice status from backend and merge with localStorage
  useEffect(() => {
    const fetchInvoiceStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token || !orders || orders.length === 0) return;

      const statusMap = {};
      for (let order of orders) {
        try {
          const res = await fetch(`${BASE_URL}/invoices/check-order/${order.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            statusMap[order.id] = data.exists || invoiceStatus[order.id] || false;
          }
        } catch (err) {
          console.error("Gagal cek invoice:", err);
        }
      }
      const mergedStatus = { ...invoiceStatus, ...statusMap };
      setInvoiceStatus(mergedStatus);
      localStorage.setItem("invoiceStatus", JSON.stringify(mergedStatus));
    };

    fetchInvoiceStatus();
  }, [orders]);

  // Helper to mark invoice created
  const markInvoiceCreated = (orderId) => {
    const updatedStatus = { ...invoiceStatus, [orderId]: true };
    setInvoiceStatus(updatedStatus);
    localStorage.setItem("invoiceStatus", JSON.stringify(updatedStatus));
  };

  return {
    filteredOrders: data,
    handleDetail,
    getStatusPengirimanText,
    isInvoiceEnabled,
    invoiceStatus,
    markInvoiceCreated,
    loading: loading || ordersLoading,
    error: error || ordersError,
  };
};
