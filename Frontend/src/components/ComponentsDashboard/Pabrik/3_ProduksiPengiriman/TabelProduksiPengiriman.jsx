import React, { useState, useEffect } from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';
import Modal from '../../Common/Modal';
import Swal from 'sweetalert2';
import { useProduksiPengiriman } from '../../../../hooks/Pabrik/useProduksiPengiriman';
import { usePabrikPriceListPage } from '../../../../hooks/Pabrik/PriceList/usePabrikPriceListPage';
import { approvePaymentByDistributor, rejectPaymentByDistributor } from '../../../../../src/services/ordersApi';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const TableProduksiPengiriman = () => {
  const { filteredOrders: hookOrders, handleDetail, getStatusPengirimanText, isInvoiceEnabled, markInvoiceCreated } = useProduksiPengiriman();
  const { filteredProduk: productPrices } = usePabrikPriceListPage();

  // STATE LOKAL agar bisa update status pembayaran
  const [orders, setOrders] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState({ invoice_number: '', invoice_date: '', due_date: '', notes: '' });
  const [message, setMessage] = useState('');
  const [invoiceExistMap, setInvoiceExistMap] = useState({});

  useEffect(() => {
    setOrders(hookOrders); // sync hook orders ke state lokal
  }, [hookOrders]);

  // Ambil status invoice per order
  useEffect(() => {
    const fetchInvoiceStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const statusMap = {};
      for (const order of orders) {
        try {
          const res = await fetch(`${BASE_URL}/invoices/order/${order.id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (!res.ok) {
            statusMap[order.id] = { exists: false, status: null, invoiceId: null };
            continue;
          }

          const data = await res.json();
          console.log("Invoice fetched for order", order.id, data);
          const key = order.id || order.orderId; // konsisten
          statusMap[key] = {
            exists: data.exists && data.pabrik_id != null,
            status: data.status ?? null,
            invoiceId: data.id ?? null,
            pabrik_id: data.pabrik_id ?? null
          };
        } catch {
          statusMap[order.id] = { exists: false, status: null, invoiceId: null };
        }
      }

      setInvoiceExistMap(statusMap);
    };

    fetchInvoiceStatus();
  }, [orders]);

  const getPabrikName = (order) => {
    return (
      order.pabrikName ||
      order.pabrik?.nama ||
      order.pabrik_name ||
      order.nama_pabrik ||
      '-'
    );
  };

  const isInvoiceEnabledFixed = (order) => {
    return (
      order.statusProduksi === 'Selesai Produksi' ||
      order.statusPengiriman === 'Dikirim' ||
      order.statusPengiriman === 'Diterima'
    );
  };

  const openInvoiceModal = async (order) => {
    try {
      const token = localStorage.getItem('token');

      const pabrikId = order.pabrik_id || order.pabrik?.id || order.pabrikId;
      const pabrikName = getPabrikName(order);

      if (!pabrikId) {
        console.error("❌ Pabrik ID tidak ditemukan pada order:", order);
        setMessage('Pabrik ID tidak ditemukan pada order.');
        return;
      }

      // request nomor invoice otomatis
      const invoiceRes = await fetch(
        `${BASE_URL}/invoices/generate/pabrik/${pabrikId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      let generatedNumber = '';
      if (invoiceRes.ok) {
        const invoiceData = await invoiceRes.json();
        generatedNumber = invoiceData.invoice_number || '';
      }

      const safeProducts = (order.products || []).map(p => {
        const priceData = productPrices.find(pp => pp.kode === p.kode_produk);
        return {
          ...p,
          quantity: Number(p.quantity || p.qty || 0),
          unitPrice: Number(p.unitPrice || priceData?.harga || 0),
        };
      });

      setSelectedOrder({ ...order, products: safeProducts, pabrik_id: pabrikId, pabrikName });
      setInvoiceForm({
        invoice_number: generatedNumber,
        invoice_date: '',
        due_date: '',
        notes: ''
      });

      setShowInvoiceModal(true);
    } catch (err) {
      console.error(err);
      setMessage('Gagal fetch nomor invoice.');
    }
  };

  const handleCreateInvoice = async () => {
    if (!selectedOrder) return;

    const amountTotal = selectedOrder.products.reduce((sum, p) => sum + (p.quantity * (p.unitPrice || 0)), 0);
    const payload = {
      order_id: selectedOrder.id,
      distributor_id: selectedOrder.distributor_id,
      pabrik_id: selectedOrder.pabrik_id,
      invoice_number: invoiceForm.invoice_number,
      invoice_date: invoiceForm.invoice_date,
      due_date: invoiceForm.due_date,
      notes: invoiceForm.notes,
      amount_total: amountTotal,
      products: selectedOrder.products
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/invoices/create-pabrik`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());

      await res.json();
      markInvoiceCreated(selectedOrder.id);

      // Ambil status default unpaid kalau baru dibuat
      setInvoiceExistMap(prev => ({
        ...prev,
        [selectedOrder.id || selectedOrder.orderId]: {
          exists: true,
          status: 'unpaid',
          invoiceId: null
        }
      }));
      setMessage('Invoice berhasil dikirim!');
      setShowInvoiceModal(false);
    } catch (err) {
      console.error(err);
      setMessage('Gagal mengirim invoice.');
    }
  };

  const handleApprovePayment = async (orderId, invoiceId) => {
    try {
      await approvePaymentByDistributor(invoiceId);
      setInvoiceExistMap(prev => ({
        ...prev,
        [orderId]: { ...prev[orderId], status: 'paid' }
      }));
      Swal.fire('Berhasil', 'Pembayaran diterima', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal', 'Terjadi kesalahan saat menerima pembayaran', 'error');
    }
  };

  const handleRejectPayment = async (orderId, invoiceId) => {
    try {
      await rejectPaymentByDistributor(invoiceId);
      setInvoiceExistMap(prev => ({
        ...prev,
        [orderId]: { ...prev[orderId], status: 'rejected' }
      }));
      Swal.fire('Berhasil', 'Pembayaran ditolak', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal', 'Terjadi kesalahan saat menolak pembayaran', 'error');
    }
  };

  const columns = [
    { label: 'No', key: 'no' },
    { label: 'Order ID', key: 'orderId' },
    { label: 'Agen', key: 'agentName' },
    { label: 'Distributor', key: 'distributor' },
    { label: 'Jumlah Produk', key: 'jumlahProduk' },
    { label: 'Status Produksi', key: 'statusProduksi', render: (_, row) => <StatusBadge status={row.statusProduksi} labelOverride={row.statusProduksiText} /> },
    { label: 'Status Pengiriman', key: 'statusPengiriman', render: (_, row) => <StatusBadge status={getStatusPengirimanText(row)} type="pengiriman" /> },
    {
      label: 'Validasi Pembayaran',
      key: 'validasi',
      render: (_, row) => {
        const invoiceInfo = invoiceExistMap[row.id];
        const statusPembayaran = (invoiceInfo?.status || '').toLowerCase();
        const isWaitingValidation = statusPembayaran === 'waiting_confirmation';

        return (
          <div className="flex gap-2 justify-center">
            <button
              disabled={!isWaitingValidation}
              className={`px-3 py-1 rounded text-sm font-semibold ${!isWaitingValidation ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
              onClick={() => handleApprovePayment(row.id, invoiceInfo?.invoiceId)}
            >Terima</button>

            <button
              disabled={!isWaitingValidation}
              className={`px-3 py-1 rounded text-sm font-semibold ${!isWaitingValidation ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
              onClick={() => handleRejectPayment(row.id, invoiceInfo?.invoiceId)}
            >Tolak</button>
          </div>
        );
      }
    },
    {
      label: 'Aksi',
      key: 'aksi',
      render: (_, order) => {
        const invoiceInfo = invoiceExistMap[order.id];
        const isLoading = invoiceInfo === undefined;
        const hasInvoiceWithPabrik = invoiceInfo?.exists && invoiceInfo?.pabrik_id != null;

        const canCreateInvoice = !isLoading && !hasInvoiceWithPabrik;

        return (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleDetail(order)}
              className="bg-btn-dark text-white font-bold px-3 py-1 rounded text-xs hover:bg-gray-800"
            >
              Detail
            </button>
            <button
              disabled={!canCreateInvoice || isLoading}
              className={`px-3 py-1 rounded text-xs font-bold ${(!canCreateInvoice || isLoading)
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-btn-dark text-white hover:bg-gray-800'
                }`}
              onClick={() => openInvoiceModal({ ...order, pabrik_id: order.pabrik?.id || order.pabrik_id })}
            >
              Buat Invoice
            </button>
          </div>
        );
      }
    },
  ];

  const dataWithIndex = orders
    .filter(order => {
      const invoiceInfo = invoiceExistMap[order.id];
      const statusPembayaran = (invoiceInfo?.status || '').toLowerCase();

      if (statusPembayaran === 'paid' && order.statusPengiriman === 'Diterima') {
        return false;
      }
      return true;
    })
    .map((order, idx) => ({
      ...order,
      no: idx + 1,
      orderId: order.orderId?.toUpperCase() || '',
      jumlahProduk: order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0,
      pabrikName: getPabrikName(order),
      pabrik_id: order.pabrik?.id || order.pabrik_id
    }));

  return (
    <div className="rounded border border-gray-200 shadow overflow-hidden">
      {message && <div className="bg-green-100 text-green-800 px-4 py-2 text-sm mb-2 rounded">{message}</div>}
      <ReusableTable columns={columns} data={dataWithIndex} className="text-sm text-center" />

      {showInvoiceModal && selectedOrder && (
        <Modal onClose={() => setShowInvoiceModal(false)} title="Buat Invoice">
          <div className="space-y-4">
            <div className="space-y-1">
              <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p><strong>Pabrik:</strong> {selectedOrder.pabrikName}</p>
              <p><strong>Distributor:</strong> {selectedOrder.distributor}</p>
            </div>
            <label>
              Nomor Invoice
              <input className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-600" value={invoiceForm.invoice_number} readOnly />
            </label>
            <label>
              Tanggal Invoice
              <input type="date" className="w-full border rounded px-2 py-1" value={invoiceForm.invoice_date} onChange={e => setInvoiceForm({ ...invoiceForm, invoice_date: e.target.value })} />
            </label>
            <label>
              Jatuh Tempo
              <input type="date" className="w-full border rounded px-2 py-1" value={invoiceForm.due_date} onChange={e => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })} />
            </label>
            <label>
              Catatan
              <textarea className="w-full border rounded px-2 py-1" value={invoiceForm.notes} onChange={e => setInvoiceForm({ ...invoiceForm, notes: e.target.value })} />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowInvoiceModal(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:opacity-90">Batal</button>
              <button onClick={handleCreateInvoice} className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">Simpan & Lanjut Buat Invoice</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TableProduksiPengiriman;
