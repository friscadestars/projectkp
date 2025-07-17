import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../Context/OrderContext'; 

export const useDaftarOrderMasuk = () => {
    const navigate = useNavigate();
    const { orders } = useOrder(); // Ambil data dari context

    const [search, setSearch] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);

    // Filter berdasarkan status "Tertunda" atau "Disetujui"
    useEffect(() => {
        const initialFiltered = orders.filter(order =>
            ['Tertunda', 'Disetujui'].includes(order.status)
        );
        setFilteredOrders(initialFiltered);
    }, [orders]);

    const searchOrders = (query) => {
        setSearch(query);
        const filtered = orders.filter(order =>
            ['Tertunda', 'Disetujui'].includes(order.status) &&
            (
                order.orderId.toLowerCase().includes(query.toLowerCase()) ||
                order.distributor.toLowerCase().includes(query.toLowerCase()) ||
                order.agentId?.toLowerCase().includes(query.toLowerCase())
            )
        );
        setFilteredOrders(filtered);
    };

    const handleDetail = (order) => {
        navigate('/pabrik/detail-order', { state: { order } });
    };

    return {
        daftarOrders: filteredOrders,
        searchOrders,
        search,
        handleDetail,
    };
};
