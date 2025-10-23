import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { distributorMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../useNavigation';
import { fetchOrderById } from '../../../services/ordersApi';
import Swal from 'sweetalert2';

export const useKirimOrderDetail = () => {
    const { orderCode } = useParams();
    const navigate = useNavigate();
    const { handleNavigation } = useNavigation(distributorMenuItems);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchOrderById(orderCode);
                setOrder(data);
            } catch (e) {
                Swal.fire('Gagal memuat order', e.message || 'Terjadi kesalahan', 'error')
                    .then(() => navigate('/distributor/kirim-order'));
            } finally {
                setLoading(false);
            }
        })();
    }, [orderCode, navigate]);

    return { order, loading, orderCode, handleNavigation };
};