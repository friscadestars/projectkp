import React, { useState, useEffect } from 'react';
import ReusableTable from '../../Common/ReusableTable';
import { useProduksiPengiriman } from '../../../../hooks/Pabrik/useProduksiPengiriman';
import StatusBadge from '../../Common/StatusBadge';
import Modal from '../../Common/Modal';
import { usePabrikPriceListPage } from '../../../../hooks/Pabrik/PriceList/usePabrikPriceListPage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const TableProduksiPengiriman = () => {
  const {
    filteredOrders,
    handleDetail,
    getStatusPengirimanText,
    isInvoiceEnabled,
    invoiceStatus,
    markInvoiceCreated
  } = useProduksiPengiriman();

  const { filteredProduk: productPrices } = usePabrikPriceListPage();

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: '',
    invoice_date: '',
    due_date: '',
    notes: '',
  });
  const [message, setMessage] = useState('');
  const [invoiceExistMap, setInvoiceExistMap] = useState({}); // Tambahan: simpan status invoice per order

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // === Fungsi baru: fetch invoice status dari backend untuk semua order ===
  useEffect(() => {
    const fetchInvoiceStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const statusMap = {};
      for (const order of filteredOrders) {
        try {
          const res = await fetch(`${BASE_URL}/invoices/order/${order.id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) continue;
          const data = await res.json();
          statusMap[order.id] = data.exists ?? false;
        } catch (err) {
          console.error('Gagal cek invoice order', order.id, err);
        }
      }
      setInvoiceExistMap(statusMap);
    };

    fetchInvoiceStatus();
  }, [filteredOrders]);

  const openInvoiceModal = async (order) => {
    const safeProducts = (order.products || []).map(p => {
      const priceData = productPrices.find(pp => pp.kode === p.kode_produk);
      return {
        ...p,
        quantity: Number(p.quantity || p.qty || 0),
        unitPrice: Number(p.unitPrice || priceData?.harga || 0),
      };
    });

    const pabrikId = Number(order.pabrik_id || 1);

    setSelectedOrder({
      ...order,
      products: safeProducts,
      pabrik_id: Number(order.pabrik_id || order.pabrikId || 1),
      agen_id: order.agen_id ?? order.agentId ?? null
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token tidak ditemukan.");

      // cek invoice sekali lagi sebelum membuka modal
      const checkRes = await fetch(`${BASE_URL}/invoices/order/${order.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const checkData = await checkRes.json();
      if (checkData.exists) {
        setMessage("Invoice untuk order ini sudah pernah dibuat.");
        setInvoiceExistMap(prev => ({ ...prev, [order.id]: true }));
        return;
      }

      const res = await fetch(`${BASE_URL}/invoices/generate/pabrik/${pabrikId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Gagal generate invoice: HTTP ${res.status}`);
      const data = await res.json();

      setInvoiceForm({
        invoice_number: data.invoice_number || '',
        invoice_date: '',
        due_date: '',
        notes: '',
      });

      setShowInvoiceModal(true);
    } catch (err) {
      console.error("Gagal generate nomor invoice:", err);
    }
  };

  const closeInvoiceModal = () => {
    setSelectedOrder(null);
    setShowInvoiceModal(false);
  };

  const handleCreateInvoice = async () => {
    if (!selectedOrder) return;

    const amountTotal = (selectedOrder.products || []).reduce(
      (sum, p) => sum + (Number(p.quantity) * Number(p.unitPrice || 0)),
      0
    );

    const payload = {
      order_id: selectedOrder.id,
      distributor_id: selectedOrder.distributor_id,
      pabrik_id: Number(selectedOrder.pabrik_id ?? selectedOrder.pabrikId ?? 1),
      agen_id: null,
      invoice_date: invoiceForm.invoice_date,
      due_date: invoiceForm.due_date,
      notes: invoiceForm.notes,
      amount_total: amountTotal,
      products: selectedOrder.products
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${BASE_URL}/invoices/create-pabrik`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Gagal simpan invoice: ${await res.text()}`);
      await res.json();

      markInvoiceCreated(selectedOrder.id);
      setInvoiceExistMap(prev => ({ ...prev, [selectedOrder.id]: true })); // update status agar button disable
      setMessage("Invoice berhasil dikirim!");
      setShowInvoiceModal(false);
    } catch (err) {
      console.error(err);
      setMessage("Gagal mengirim invoice.");
    }
  };

  const columns = [
    { label: 'No', key: 'no' },
    { label: 'Order ID', key: 'orderId' },
    { label: 'Agen', key: 'agentName' },
    { label: 'Distributor', key: 'distributor' },
    { label: 'Alamat Agen', key: 'alamat' },
    { label: 'Jumlah Produk', key: 'jumlahProduk' },
    {
      label: 'Status Produksi',
      key: 'statusProduksi',
      render: (_, row) => <StatusBadge status={row.statusProduksi} labelOverride={row.statusProduksiText} />
    },
    {
      label: 'Status Pengiriman',
      key: 'statusPengiriman',
      render: (_, row) => <StatusBadge status={getStatusPengirimanText(row)} type="pengiriman" />
    },
    {
      label: "Aksi",
      key: "aksi",
      render: (_, order) => {
        const invoiceExists = invoiceExistMap[order.id] ?? false;
        const canCreateInvoice = isInvoiceEnabled(order);

        let buttonLabel = "Buat Invoice";
        if (invoiceExists) buttonLabel = "Buat Invoice";
        else if (!canCreateInvoice) buttonLabel = "Buat Invoice";

        const disabled = invoiceExists || !canCreateInvoice;

        return (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleDetail(order)}
              className="bg-btn-dark text-white px-3 py-1 rounded text-xs hover:bg-gray-800"
            >
              Detail
            </button>
            <button
              disabled={disabled}
              onClick={() => openInvoiceModal(order)}
              className={`px-3 py-1 rounded text-xs ${disabled
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-btn-dark text-white hover:bg-gray-800"
                }`}
            >
              {buttonLabel}
            </button>
          </div>
        );
      },
    },
  ];

  const dataWithIndex = filteredOrders.map((order, idx) => ({
    ...order,
    no: idx + 1,
    orderId: order.orderId?.toUpperCase() || '',
    jumlahProduk: order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0,
  }));

  return (
    <div className="rounded border border-gray-200 shadow overflow-hidden">
      {message && <div className="bg-green-100 text-green-800 px-4 py-2 text-sm mb-2 rounded">{message}</div>}
      <ReusableTable columns={columns} data={dataWithIndex} className="text-sm text-center" />

      {showInvoiceModal && selectedOrder && (
        <Modal onClose={closeInvoiceModal} title="Buat Invoice">
          <div className="space-y-4">
            <div className="space-y-1">
              <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p><strong>Pabrik:</strong> {selectedOrder.pabrikName}</p>
              <p><strong>Distributor:</strong> {selectedOrder.distributor}</p>
              <p><strong>Tanggal Order:</strong> {formatDate(selectedOrder.orderDate)}</p>
            </div>

            <div className="space-y-2">
              <label>
                Nomor Invoice
                <input className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-600" value={invoiceForm.invoice_number} readOnly />
              </label>
              <label>
                Tanggal Invoice
                <input type="date" className="w-full border rounded px-2 py-1" value={invoiceForm.invoice_date} onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_date: e.target.value })} />
              </label>
              <label>
                Jatuh Tempo
                <input type="date" className="w-full border rounded px-2 py-1" value={invoiceForm.due_date} onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })} />
              </label>
              <label>
                Catatan
                <textarea className="w-full border rounded px-2 py-1" value={invoiceForm.notes} onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })} />
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeInvoiceModal} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:opacity-90">Batal</button>
              <button onClick={handleCreateInvoice} className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">Simpan & Lanjut Buat Invoice</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TableProduksiPengiriman;
