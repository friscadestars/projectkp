// src/hooks/Agen/useRiwayatOrder.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompletedOrdersForHistory } from '../../../services/ordersApi';
import { deleteOrderById } from '../../../services/ordersApi';
import Swal from 'sweetalert2';

const useRiwayatOrder = () => {
    const [orders, setOrders] = useState([]);
    const [entries, setEntries] = useState(10);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchCompletedOrdersForHistory();
                if (mounted) setOrders(data);
            } catch (e) {
                if (mounted) setError(e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Apakah kamu yakin?',
            text: "Riwayat order akan dihapus secara permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await deleteOrderById(id);
                setOrders((prev) => prev.filter((o) => o.orderId !== id));

                await Swal.fire({
                    title: 'Berhasil!',
                    text: 'Order berhasil dihapus.',
                    icon: 'success',
                    timer: 1500,
                    confirmButtonColor: '#2563eb',
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Terjadi kesalahan saat menghapus order.',
                    icon: 'error'
                });
            }
        }
    };

    const handleDetail = (order) => {
        navigate(`/agen/detail-riwayat-order/${order.id}`);
    };

    return {
        showDropdown,
        setShowDropdown,
        handleDelete,
        handleDetail,
        completedOrders: orders,
        loading,
        error,
        entries,
        setEntries,
    };
};

export default useRiwayatOrder;
