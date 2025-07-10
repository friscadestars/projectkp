import React, { useState } from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout.jsx';
import PageHeader from '../../Components/ComponentsDashboard/Common/PageHeader';
import SearchInput from '../../Components/ComponentsDashboard/Common/SearchInput';
import MonitoringOrderTable from '../../Components/ComponentsDashboard/Distributor/Monitoring/MonitoringOrderTable';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import iconMonitoring from '../../assets/IconHeader/MonitoringIcon.png';
import { useOrder } from '../../Context/OrderContext.jsx';
import { useNavigation } from '../../hooks/useNavigation';

const MonitoringOrder = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [search, setSearch] = useState('');

    const { handleNavigation } = useNavigation(distributorMenuItems);
    const { orders } = useOrder();

    const allowedStatuses = ['Disetujui', 'Diproses', 'Dikirim', 'Diterima'];

    const filteredOrders = orders.filter(order =>
        allowedStatuses.includes(order.status) &&
        order.orderId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AgenLayout
            menuItems={distributorMenuItems}
            activeLabel="Monitoring Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
        >
            <PageHeader icon={iconMonitoring} title="Monitoring Order" />

            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari berdasarkan Order ID"
                    className="mb-4"
                />
                <MonitoringOrderTable orders={filteredOrders} />
            </div>
        </AgenLayout>
    );
};

export default MonitoringOrder;
