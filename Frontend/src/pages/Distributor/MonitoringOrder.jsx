import React, { useState } from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout.jsx';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import { useMonitoringOrderPage } from '../../hooks/Distributor/Monitoring/useMonitoringOrderPage';
import MonitoringOrderContent from '../../components/ComponentsDashboard/Distributor/Monitoring/MonitoringOrder/MonitoringOrderContent';


const MonitoringOrder = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation(distributorMenuItems);
    const { search, setSearch, filteredOrders } = useMonitoringOrderPage();

    return (
        <AgenLayout
            menuItems={distributorMenuItems}
            activeLabel="Monitoring Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
        >
            <MonitoringOrderContent
                search={search}
                setSearch={setSearch}
                filteredOrders={filteredOrders}
            />
        </AgenLayout>
    );
};

export default MonitoringOrder;
