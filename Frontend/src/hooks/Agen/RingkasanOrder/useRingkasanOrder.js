import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { agenMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../useNavigation';

// Ubah sesuai alamat API kamu
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const useRingkasanOrder = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();
    const { handleNavigation } = useNavigation(agenMenuItems);

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const agenId = user.id;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token'); // atau ambil dari user.token jika kamu simpan di situ

                const response = await fetch(`${API_BASE_URL}/orders`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Gagal mengambil data');
                }

                if (!Array.isArray(data)) {
                    throw new Error('Data dari server tidak dalam bentuk array');
                }

                const filtered = data.filter(order => order.agen && order.agen_id === agenId);

                const transformed = filtered.map(order => ({
                    id: order.id,
                    orderId: order.order_code,
                    distributor: order.distributor,
                    orderDate: new Date(order.order_date).toLocaleDateString('id-ID'),
                    deliveryDate: order.delivery_date
                        ? new Date(order.delivery_date).toLocaleDateString('id-ID')
                        : null,
                    noResi: order.resi || '-',
                    status: mapStatus(order.status),
                    products: order.items || [],
                }));

                setOrders(transformed);
            } catch (error) {
                console.error('Gagal mengambil data order:', error);
            }
        };

        if (agenId) {
            fetchOrders();
        }
    }, [agenId]);

    const mapStatus = (status) => {
        const mapping = {
            pending: 'Tertunda',
            approved: 'Disetujui',
            processing: 'Diproses',
            shipped: 'Dikirim',
            delivered: 'Selesai'
        };
        return mapping[status] || status;
    };

    const handleDetail = (order) => {
        navigate(`/agen/ringkasan-order/${order.id}`);
    };

    const handleConfirm = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const confirmReceipt = () => {
        const updated = orders.map(order => {
            if (order.orderId === selectedId && order.status === 'Dikirim') {
                const total = order.products.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
                return {
                    ...order,
                    status: 'delivered',
                    receivedDate: new Date().toLocaleDateString('id-ID'),
                    total,
                };
            }
            return order;
        });

        setOrders(updated);
        setShowModal(false);
        setSelectedId(null);
    };

    const cancelReceipt = () => {
        setShowModal(false);
        setSelectedId(null);
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Tertunda':
                return 'bg-yellow-500 text-white font-bold';
            case 'Disetujui':
                return 'bg-green-600 text-white font-bold';
            case 'Diproses':
                return 'bg-blue-500 text-white font-bold';
            case 'Ditolak':
                return 'bg-red-500 text-white font-bold';
            case 'Dikirim':
                return 'bg-[#17A2B8] text-white font-bold';
            case 'Selesai':
                return 'bg-green-700 text-white font-bold';
            default:
                return '';
        }
    };

    const getEstimatedDate = (order) => {
        if (!order.deliveryDate || order.deliveryDate === '-') return '-';

        const date = new Date(order.deliveryDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const parseDate = (date) => {
        if (!date || date === '-') return new Date(0);
        const [d, m, y] = date.split('/').map(Number);
        return new Date(y, m - 1, d);
    };

    const allowedStatuses = ['Tertunda', 'Disetujui', 'Diproses', 'Ditolak', 'Dikirim'];

    const filteredOrders = orders
        .filter(order =>
            allowedStatuses.includes(order.status) &&
            (
                (order.orderId && order.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (order.distributor && order.distributor.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (order.status && order.status.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        )
        .sort((a, b) => {
            const dateA = parseDate(a.orderDate);
            const dateB = parseDate(b.orderDate);
            return dateB - dateA || parseInt(b.orderId?.split('-')[1] || 0) - parseInt(a.orderId?.split('-')[1] || 0);
        });

    return {
        searchTerm,
        setSearchTerm,
        showModal,
        showDropdown,
        setShowDropdown,
        filteredOrders,
        handleNavigation,
        handleDetail,
        handleConfirm,
        confirmReceipt,
        cancelReceipt,
        getStatusClasses,
        getEstimatedDate,
    };
};

export default useRingkasanOrder;
