// src/hooks/Distributor/Monitoring/useMonitoringOrderDetail.js
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchOrderDetailById } from '../../../services/ordersApi';

export const useMonitoringOrderDetail = () => {
    const { orderId } = useParams(); // ini numeric (id) dari url
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchOrderDetailById(orderId);
                setOrder(data);
            } catch (e) {
                console.error(e);
                Swal.fire('Gagal', e?.message ?? 'Gagal memuat order', 'error')
                    .then(() => navigate('/distributor/monitoring-order'));
            } finally {
                setLoading(false);
            }
        })();
    }, [orderId, navigate]);

    return { order, loading };
};
