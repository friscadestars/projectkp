import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import DetailOrderContent from '../../components/ComponentsDashboard/Distributor/Monitoring/MonitoringOrder/DetailOrderContent';
import { distributorMenuItems } from '../../components/ComponentsDashboard/Constants/menuItems';
import { useOrderDetail } from '../../hooks/Distributor/DetailOrder/useOrderDetail';
import { useNavigation } from '../../hooks/useNavigation';
import iconMonitoring from '../../assets/IconHeader/MonitoringIcon.png';

const DetailMonitoringOrder = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { order } = useOrderDetail();
    const { handleNavigation } = useNavigation(distributorMenuItems);

    if (!order) return <div className="p-8 text-red-500">Order tidak ditemukan.</div>;

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Monitoring Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(!showDropdown)}
            role="distributor" 
        >
            <DetailOrderContent
                order={order}
                icon={iconMonitoring}
                titleText="Monitoring Order"
            />
        </Layout>
    );
};

export default DetailMonitoringOrder;
