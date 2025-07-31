import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../Common/StatusBadge';
import ReusableTable from '../../../Common/ReusableTable';
import Modal from '../../../Common/Modal';
import { fetchOrders } from '../../../../../services/ordersApi';
import { mapOrder } from '../../../../../services/ordersApi';

const MonitoringOrderTable = ({ orders }) => {
    const navigate = useNavigate();
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [invoiceForm, setInvoiceForm] = useState({
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
        notes: ''
    });

    useEffect(() => {
        const loadData = async () => {
            const response = await fetchOrders();
            const formatted = response.map(mapOrder);
            setOrders(formatted);
        };
        loadData();
    }, []);

    const formatDate = (val) =>
        val
            ? new Date(val).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })
            : '-';

    const handleOpenInvoiceModal = (order) => {
        console.log('RAW ORDER sebelum mapping:', order);
        const mappedOrder = {
            ...order,
            agen_id: order.agen_id || order.agen?.id,
            distributorId: order.distributorId || order.distributor_id,
            products: order.products || [],
        };
        console.log('MAPPED ORDER setelah mapping:', mappedOrder);
        setSelectedOrder(mappedOrder);
        setShowInvoiceModal(true);
    };


    const handleCloseInvoiceModal = () => {
        setSelectedOrder(null);
        setShowInvoiceModal(false);
    };

    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1,
        },
        { header: 'Order ID', key: 'orderCode', render: (v) => (v || '').toUpperCase() },
        { header: 'Agen', key: 'agenName' },
        {
            header: 'Pabrik',
            key: 'pabrikName',
            render: (val) => val || 'Pabrik tidak diketahui',
        },
        {
            header: 'Tanggal Order',
            key: 'orderDate',
            render: (val) => formatDate(val),
        },
        {
            header: 'Estimasi Sampai',
            key: 'deliveryDate',
            render: (val) => val?.split(' ')[0] || '-',
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (val) => <StatusBadge status={val} />,
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <div className="button-group flex flex-wrap gap-2 justify-center">
                    <button
                        className="px-4 py-1 bg-blue-900 text-white text-sm rounded font-semibold hover:opacity-90"
                        onClick={() =>
                            navigate(`/distributor/monitoring-order/detail/${row.orderId}`)
                        }
                    >
                        Detail
                    </button>
                    <button
                        className="px-4 py-1 bg-green-700 text-white text-sm rounded font-semibold hover:opacity-90"
                        onClick={() => handleOpenInvoiceModal(row)}
                    >
                        Buat Invoice
                    </button>
                </div>
            ),
        },
    ];

    const handleCreateInvoice = async () => {
        console.log('Mulai buat invoice...');
        console.log("selectedOrder:", selectedOrder);
        console.log("selectedOrder.agen_id:", selectedOrder?.agen_id);
        console.log("selectedOrder.products:", selectedOrder?.products);
        if (!selectedOrder || !selectedOrder.products || selectedOrder.products.length === 0) {
            alert('Data order tidak lengkap.');
            return;
        }

        const payload = {
            order_id: selectedOrder.orderId,
            order_item_ids: selectedOrder.products.map(p => p.id),
            agen_id: selectedOrder.agen_id,
            distributor_id: selectedOrder.distributorId, // bisa juga dari context login
            invoice_number: invoiceForm.invoice_number || `INV-${selectedOrder.orderCode}`,
            invoice_date: invoiceForm.invoice_date,
            due_date: invoiceForm.due_date,
            amount_total:
                selectedOrder.totalAmount ||
                selectedOrder.products.reduce((sum, p) => sum + (p.unitPrice || 0) * (p.quantity || 0), 0),
            tax_amount: 0,
            status: 'unpaid',
            notes: invoiceForm.notes
        };

        try {
            const response = await fetch(`/distributor/${selectedOrder.agen_id}/invoices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Invoice berhasil dibuat dan dikirim ke agen.');
                setShowInvoiceModal(false);
            } else {
                console.error(data);
                alert('Gagal membuat invoice.');
            }
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan saat mengirim invoice.');
        }
        console.log('Selesai proses buat invoice.');
    };

    return (
        <>
            <ReusableTable
                columns={columns}
                data={orders}
                footer={
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="px-4 py-3 text-sm text-right font-medium text-gray-600 border-t border-gray-300"
                        >
                            Total Order: {orders.length}
                        </td>
                    </tr>
                }
            />

            {showInvoiceModal && selectedOrder && (
                <Modal onClose={handleCloseInvoiceModal} title="Buat Invoice">
                    <div className="space-y-4">
                        {/* Informasi Order */}
                        <div className="space-y-1">
                            <p><strong>Order ID:</strong> {selectedOrder.orderCode}</p>
                            <p><strong>Agen:</strong> {selectedOrder.agenName}</p>
                            <p><strong>Pabrik:</strong> {selectedOrder.pabrikName}</p>
                            <p><strong>Tanggal Order:</strong> {formatDate(selectedOrder.orderDate)}</p>
                        </div>

                        {/* Form Invoice */}
                        <div className="space-y-2">
                            <label>
                                Nomor Invoice
                                <input
                                    className="w-full border rounded px-2 py-1"
                                    value={invoiceForm.invoice_number}
                                    onChange={(e) =>
                                        setInvoiceForm({ ...invoiceForm, invoice_number: e.target.value })
                                    }
                                />
                            </label>

                            <label>
                                Tanggal Invoice
                                <input
                                    type="date"
                                    className="w-full border rounded px-2 py-1"
                                    value={invoiceForm.invoice_date}
                                    onChange={(e) =>
                                        setInvoiceForm({ ...invoiceForm, invoice_date: e.target.value })
                                    }
                                />
                            </label>

                            <label>
                                Jatuh Tempo
                                <input
                                    type="date"
                                    className="w-full border rounded px-2 py-1"
                                    value={invoiceForm.due_date}
                                    onChange={(e) =>
                                        setInvoiceForm({ ...invoiceForm, due_date: e.target.value })
                                    }
                                />
                            </label>

                            <label>
                                Catatan
                                <textarea
                                    className="w-full border rounded px-2 py-1"
                                    value={invoiceForm.notes}
                                    onChange={(e) =>
                                        setInvoiceForm({ ...invoiceForm, notes: e.target.value })
                                    }
                                />
                            </label>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={handleCloseInvoiceModal}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:opacity-90"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleCreateInvoice}
                                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                            >
                                Simpan & Lanjut Buat Invoice
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default MonitoringOrderTable;
