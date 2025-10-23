import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompletedOrdersForHistory } from '../../../services/ordersApi';
import Swal from 'sweetalert2';

const LOCAL_STORAGE_KEY = 'deletedAgenOrderIds';

const useRiwayatOrder = () => {
    const [orders, setOrders] = useState([]);
    const [entries, setEntries] = useState(10);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const getDeletedIds = () =>
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchCompletedOrdersForHistory();

                if (mounted) {
                    let deletedIds = getDeletedIds();

                    let validDeletedIds = deletedIds.filter(
                        (id) => !data.some(order => String(order.orderId) === String(id))
                    );
                    ar
                    const maxDeletedId = Math.max(...deletedIds.map(Number), 0);
                    const maxOrderId = Math.max(...data.map(o => Number(o.orderId)), 0);
                    if (maxOrderId > maxDeletedId) {
                        validDeletedIds = [];
                    }

                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(validDeletedIds));

                    const filtered = data.filter(
                        (order) => !validDeletedIds.includes(String(order.orderId))
                    );

                    setOrders(filtered);
                }
            } catch (e) {
                if (mounted) setError(e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false };
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Apakah kamu yakin?',
            text: 'Riwayat order akan dihapus dari tampilan ini saja.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
            const deletedIds = getDeletedIds();
            if (!deletedIds.includes(id)) {
                localStorage.setItem(
                    LOCAL_STORAGE_KEY,
                    JSON.stringify([...deletedIds, id])
                );
            }

            setOrders((prev) => prev.filter((o) => o.orderId !== id));

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Order dihapus dari tampilan.',
                icon: 'success',
                timer: 1500,
                confirmButtonColor: '#2563eb',
            });
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
