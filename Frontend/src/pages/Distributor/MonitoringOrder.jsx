import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout.jsx';
import { distributorMenuItems } from '../../components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import { useMonitoringOrderPage } from '../../hooks/Distributor/Monitoring/useMonitoringOrderPage';
import MonitoringOrderContent from '../../components/ComponentsDashboard/Distributor/Monitoring/MonitoringOrder/MonitoringOrderContent';

const MonitoringOrder = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation(distributorMenuItems);
    const { search, setSearch, filteredOrders } = useMonitoringOrderPage();

    // ✅ Mapping untuk memastikan setiap order punya 'agentId'
    const mappedOrders = filteredOrders.map((o) => ({
        ...o,
        agentId: o.agen_id ?? o.agen?.id ?? null,
    }));

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Monitoring Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
            role="distributor"
        >
            <MonitoringOrderContent
                search={search}
                setSearch={setSearch}
                filteredOrders={mappedOrders} // ✅ kirim hasil mapping
            />
        </Layout>
    );
};

export default MonitoringOrder;
