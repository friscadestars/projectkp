import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../Common/StatusBadge';
import ReusableTable from '../../../Common/ReusableTable';
import Modal from '../../../Common/Modal';
import { API_BASE } from '../../../../../services/ordersApi';
import { useAuth } from '../../../../../Context/AuthContext';

const getPabrikNameById = async (id, token) => {
    try {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        return data?.name || 'Pabrik tidak diketahui';
    } catch (err) {
        console.error('Gagal mengambil nama pabrik:', err);
        return 'Pabrik tidak diketahui';
    }
};

const MonitoringOrderTable = ({ orders, loading }) => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [invoiceForm, setInvoiceForm] = useState({
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
        notes: ''
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    const formatDate = (val) => {
        if (!val) return '-';
        const date = new Date(val);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const handleOpenInvoiceModal = async (order) => {
        console.log('ORDER YANG DIPILIH:', order);

        const agenId = typeof order.agentId === 'number' && !isNaN(order.agentId)
            ? order.agentId
            : null;

        if (!agenId) {
            setMessage('Data agen tidak valid. Tidak dapat membuat invoice.');
            setMessageType('error');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/orders/${order.orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const fullOrder = await res.json();

            let pabrikName = fullOrder.pabrik_name ?? fullOrder.pabrikName;
            if (!pabrikName && fullOrder.pabrik_id) {
                pabrikName = await getPabrikNameById(fullOrder.pabrik_id, token);
            }

            const mappedOrder = {
                ...fullOrder,
                status: (order.status || order.status_order || '').toLowerCase(),
                orderCode: fullOrder.order_code ?? fullOrder.orderCode,
                agenName: fullOrder.agen ?? fullOrder.agenName,
                pabrikName: pabrikName,
                agentName: fullOrder.agen ?? fullOrder.agenName,
                factoryName: fullOrder.pabrik_name ?? fullOrder.pabrikName,
                orderDate: (fullOrder.order_date || fullOrder.orderDate || '').split(' ')[0],
                invoiceNumber: invoiceForm.invoice_number || `INV-${(fullOrder.order_code || fullOrder.orderCode || '').toUpperCase()}`,
                deliveryDate: fullOrder.delivery_date ?? fullOrder.deliveryDate ?? '-',
                noResi: fullOrder.resi ?? order.noResi ?? '-',
                invoiceDate: invoiceForm.invoice_date,
                dueDate: invoiceForm.due_date,
                note: fullOrder.note ?? '',
                order_items: fullOrder.order_items ?? fullOrder.items ?? [],
                distributorId: fullOrder.distributorId ?? fullOrder.distributor_id ?? user?.id,
                agen_id: fullOrder.agen_id ?? fullOrder.agentId ?? null,
            };

            try {

                const resInvoice = await fetch(`${API_BASE}/invoices/generate/distributor/${mappedOrder.distributorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const invoiceData = await resInvoice.json();

                console.log("DATA invoice number:", invoiceData);
                console.log("Status response:", resInvoice.status);

                const generatedInvoiceNumber = resInvoice.ok && invoiceData?.invoice_number
                    ? invoiceData.invoice_number
                    : `INV-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${mappedOrder.distributorId}-${mappedOrder.orderCode}`;

                setInvoiceForm({
                    ...invoiceForm,
                    invoice_number: generatedInvoiceNumber,
                    invoice_date: new Date().toISOString().split('T')[0],
                    due_date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
                    notes: ''
                });
            } catch (error) {
                console.error('Gagal generate nomor invoice:', error);
                setInvoiceForm({
                    ...invoiceForm,
                    invoice_number: 'ERROR',
                });
            }

            console.log('selectedOrder.order_items:', mappedOrder.order_items);

            const checkInvoice = await fetch(`${API_BASE}/invoices/order/${mappedOrder.id}?distributorId=${mappedOrder.distributorId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const invoiceCheckData = await checkInvoice.json();
            const isInvoiceExist = checkInvoice.ok && invoiceCheckData?.exists;

            if (isInvoiceExist) {
                setMessage('Invoice untuk order ini sudah pernah dibuat untuk distributor ini.');
                setMessageType('error');
                return;
            }

            setSelectedOrder(mappedOrder);
            setShowInvoiceModal(true);
        } catch (err) {
            console.error('Gagal ambil detail order:', err);
            alert('Tidak bisa membuka invoice: gagal ambil data order.');
        }
    };


    const handleCloseInvoiceModal = () => {
        setSelectedOrder(null);
        setShowInvoiceModal(false);
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

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
            header: 'Tanggal Pengiriman',
            key: 'deliveryDate',
            render: formatDate,
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (val) => <StatusBadge status={val} />,
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => {
                const isInvoiceAllowed = ['processing', 'shipped',].includes(row.status?.toLowerCase());
                const isInvoiceExist = row?.invoiceExist;
                const isDisabled = !isInvoiceAllowed || isInvoiceExist;

                return (
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
                            className={`px-4 py-1 text-sm rounded font-semibold ${isDisabled
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-900 text-white hover:opacity-90'
                                }`}
                            onClick={() => {
                                if (!isDisabled) handleOpenInvoiceModal(row);
                            }}
                            disabled={isDisabled}
                        >
                            Buat Invoice
                        </button>
                    </div>
                );
            }
        }
    ];

    const handleCreateInvoice = async () => {
        if (!selectedOrder || !selectedOrder.order_items || selectedOrder.order_items.length === 0) {
            setMessage('Data order tidak lengkap.');
            setMessageType('error');
            return;
        }

        console.log('Mulai buat invoice...');
        console.log('selectedOrder:', selectedOrder);
        console.log('selectedOrder.products:', selectedOrder.products);
        const orderItemIds = selectedOrder?.order_items
            ?.map(item => Number(item.id))
            .filter(id => !isNaN(id));

        const payload = {
            order_id: selectedOrder.id,
            order_item_ids: selectedOrder.order_items.map((item) => item.id),
            agen_id: selectedOrder.agen_id,
            distributor_id: selectedOrder.distributorId,
            invoice_number: invoiceForm.invoice_number || `INV-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${selectedOrder.distributorId}-${selectedOrder.orderCode}`,
            invoice_date: invoiceForm.invoice_date,
            due_date: invoiceForm.due_date,
            amount_total:
                selectedOrder.totalAmount ||
                selectedOrder.order_items.reduce((sum, item) => sum + (item.unit_price || 0) * (item.quantity || 0), 0),
            tax_amount: 0,
            status: 'unpaid',
            notes: invoiceForm.notes
        };

        console.log('Payload yang dikirim:', payload);

        try {
            const response = await fetch(`${API_BASE}/invoices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            let data = {};
            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (response.ok) {
                setMessage('Invoice berhasil dibuat dan dikirim ke agen.');
                setMessageType('success');
                setShowInvoiceModal(false);
            } else {
                setMessage(`Gagal membuat invoice: ${data.message || 'Terjadi kesalahan'}`);
                setMessageType('error');
            }
        } catch (err) {
            console.error('Terjadi kesalahan saat mengirim invoice:', err);
            alert('Terjadi kesalahan saat mengirim invoice.');
        } finally {
            console.log('Selesai proses buat invoice.');
        }
    };


    return (
        <>
            {message && (
                <div className={`px-4 py-2 mb-2 rounded ${messageType === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {message}
                </div>
            )}
            <ReusableTable
                columns={columns}
                data={orders}
                loading={loading}
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
                            <p><strong>Order ID:</strong> {selectedOrder.orderCode?.toUpperCase()}</p>
                            <p><strong>Agen:</strong> {selectedOrder.agenName}</p>
                            <p><strong>Pabrik:</strong> {selectedOrder.pabrikName}</p>
                            <p><strong>Tanggal Order:</strong> {formatDate(selectedOrder.orderDate)}</p>
                        </div>

                        {/* Form Invoice */}
                        <div className="space-y-2">
                            <label>
                                Nomor Invoice
                                <input
                                    className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-600"
                                    value={invoiceForm.invoice_number}
                                    readOnly
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
