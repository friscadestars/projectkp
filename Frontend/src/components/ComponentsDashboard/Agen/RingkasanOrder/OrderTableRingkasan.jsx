import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../Common/ReusableTable';
import { useOrder } from '../../../../Context/OrderContext';
import StatusBadge from '../../Common/StatusBadge';

const OrderTableRingkasan = ({ orders, getEstimatedDate, getStatusClasses, onDetail, loading }) => {
    const { moveToHistory, setOrderToApproved } = useOrder();
    const navigate = useNavigate();

    const showConfirmation = async (orderId) => {
        const result = await Swal.fire({
            title: 'Konfirmasi Penerimaan Order',
            text: 'Apakah Anda yakin pesanan sudah benar-benar diterima?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Diterima',
            cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
            try {
                Swal.showLoading();
                await setOrderToApproved(orderId);
                moveToHistory(orderId);

                Swal.fire({
                    title: 'Berhasil!',
                    text: `Order telah berhasil diterima.`,
                    icon: 'success',
                    confirmButtonColor: '#2563eb',
                }).then(() => {
                    navigate('/agen/riwayat-order');
                });
            } catch (err) {
                console.error(err);
                Swal.fire('Gagal!', 'Terjadi kesalahan saat mengupdate status.', 'error');
            }
        }
    };

    const parseDate = (dateString) => {
        if (!dateString) return '-';
        const [d, m, y] = dateString.split('/').map(Number);
        const date = new Date(y, m - 1, d);
        return isNaN(date) ? '-' : `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    };

    const columns = [
        { header: 'No', key: 'no', render: (_, __, rowIndex) => rowIndex + 1 },
        {
            header: 'Order ID',
            key: 'orderId',
            render: (value) => value?.toUpperCase(),
        },
        { header: 'Distributor', key: 'distributor' },
        { header: 'Tanggal Order', key: 'orderDate', render: parseDate },
        {
            header: 'Tanggal Pengiriman',
            key: 'deliveryDate',
            render: parseDate
        },
        {
            header: 'No. Resi',
            key: 'noResi',
            render: (value) => value || '-',
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (value, row) => {
                return <StatusBadge status={row.rawStatus} />;
            }
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => {
                return (
                    <div className="flex flex-wrap justify-center gap-2">
                        <button onClick={() => onDetail(row)} className="button-detail">
                            Detail
                        </button>
                        <button
                            onClick={() => showConfirmation(row.orderId)}
                            disabled={row.status !== 'Dikirim'}
                            className={`button-confirm ${row.status === 'Dikirim' ? 'active' : 'disabled cursor-not-allowed'}`}
                        >
                            Diterima
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <ReusableTable
            columns={columns}
            data={orders}
            loading={loading}
            footer={
                <tr>
                    <td colSpan={columns.length} className="px-4 py-3 text-right font-medium text-gray-600">
                        Total Order: {orders.length}
                    </td>
                </tr>
            }
        />
    );
};

export default OrderTableRingkasan;
