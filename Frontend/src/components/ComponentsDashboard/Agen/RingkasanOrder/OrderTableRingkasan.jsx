import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../Common/ReusableTable';
import { useOrder } from '../../../../Context/OrderContext';

const OrderTableRingkasan = ({ orders, onDetail, getEstimatedDate, getStatusClasses }) => {
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
            setOrderToApproved(orderId);
            moveToHistory(orderId);
            Swal.fire({
                title: 'Berhasil!',
                text: `Order ${orderId} telah dikonfirmasi diterima.`,
                icon: 'success',
                confirmButtonColor: '#2563eb',
            }).then(() => {
                navigate('/agen/riwayat-order');
            });
        }
    };

    const columns = [
        { header: 'No', key: 'no', render: (_, __, rowIndex) => rowIndex + 1 },
        { header: 'Order ID', key: 'orderId' },
        { header: 'Distributor', key: 'distributor' },
        { header: 'Tanggal Order', key: 'orderDate' },
        { header: 'Estimasi Sampai', key: 'deliveryEstimate', render: (_, row) => getEstimatedDate(row) },
        { header: 'No. Resi', key: 'noResi', render: (value) => value || '-' },
        {
            header: 'Status Order',
            key: 'status',
            render: (value) => (
                <span className={`status-badge ${getStatusClasses(value)}`}>
                    {value}
                </span>
            ),
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
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
            ),
        },
    ];

    return (
        <ReusableTable
            columns={columns}
            data={orders}
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
