// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useOrder } from '../../Context/OrderContext'; 

// export const useDaftarOrderMasuk = () => {
//     const navigate = useNavigate();
//     const { orders } = useOrder(); // Ambil data dari context

//     const [search, setSearch] = useState('');
//     const [filteredOrders, setFilteredOrders] = useState([]);

//     // Filter berdasarkan status "Tertunda" atau "Disetujui"
//     useEffect(() => {
//         const initialFiltered = orders.filter(order =>
//             ['Tertunda', 'Disetujui'].includes(order.status)
//         );
//         setFilteredOrders(initialFiltered);
//     }, [orders]);

//     const searchOrders = (query) => {
//         setSearch(query);
//         const filtered = orders.filter(order =>
//             ['Tertunda', 'Disetujui'].includes(order.status) &&
//             (
//                 order.orderId.toLowerCase().includes(query.toLowerCase()) ||
//                 order.distributor.toLowerCase().includes(query.toLowerCase()) ||
//                 order.agentId?.toLowerCase().includes(query.toLowerCase())
//             )
//         );
//         setFilteredOrders(filtered);
//     };

//     const handleDetail = (order) => {
//         navigate('/pabrik/detail-order', { state: { order } });
//     };

//     return {
//         daftarOrders: filteredOrders,
//         searchOrders,
//         search,
//         handleDetail,
//     };
// };


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../services/ordersApi';

export const useDaftarOrderMasuk = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            try {
                const allOrders = await fetchOrders();

                // Filter hanya order yang status-nya "Disetujui"
                const filtered = allOrders.filter(order =>
                String(order.status).toLowerCase() === 'approved'
                );

                setOrders(filtered);
                setFilteredOrders(filtered);
            } catch (error) {
                console.error('❌ Gagal memuat orders:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const searchOrders = (query) => {
        setSearch(query);
        const lowerQuery = query.toLowerCase();

        const result = orders.filter(order =>
            order.orderId.toLowerCase().includes(lowerQuery) ||
            order.distributorName?.toLowerCase().includes(lowerQuery) ||
            String(order.agentId).toLowerCase().includes(lowerQuery)
        );

        setFilteredOrders(result);
    };

    const handleDetail = (order) => {
        navigate('/pabrik/detail-order', { state: { order } });
    };

    return {
        daftarOrders: filteredOrders,
        searchOrders,
        search,
        loading,
        handleDetail,
    };
};
