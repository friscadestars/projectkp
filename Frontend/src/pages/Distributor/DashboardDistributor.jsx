// src/Pages/Distributor/DashboardDistributor.jsx
import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import DashboardDistributorContent from '../../components/ComponentsDashboard/Distributor/Dashboard/DashboardDistributorContent';

const DashboardDistributor = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation(distributorMenuItems);

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Dashboard"
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
            onNavigate={handleNavigation}
        >
            <DashboardDistributorContent />
        </Layout>
    );
};

export default DashboardDistributor;
