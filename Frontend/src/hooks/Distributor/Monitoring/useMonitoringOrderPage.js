// src/hooks/Distributor/Monitoring/useMonitoringOrderPage.js
import { useState } from 'react';
import { useOrder } from '../../../Context/OrderContext';

export const useMonitoringOrderPage = () => {
    const [search, setSearch] = useState('');
    const { orders } = useOrder();

    const allowedStatuses = ['Diproduksi', 'Diproses', 'Dikirim', 'Diterima'];

    const filteredOrders = orders.filter(order =>
        allowedStatuses.includes(order.status) &&
        order.orderId.toLowerCase().includes(search.toLowerCase())
    );

    return {
        search,
        setSearch,
        filteredOrders
    };
};
