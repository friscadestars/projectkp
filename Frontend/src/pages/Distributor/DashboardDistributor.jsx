import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useDashboardData } from '../../hooks/Distributor/useDashboardData';
import { useNavigation } from '../../hooks/useNavigation';
import DashboardWelcomeHeader from '../../Components/ComponentsDashboard/Common/PageHeader';
import DashboardSummary from '../../Components/ComponentsDashboard/Card/DashboardSummary';
import ShippingStatusTable from '../../Components/ComponentsDashboard/Agen/Table/ShippingStatusTable';
import IconWelcome from '../../assets/IconHeader/IconWelcome.png';

const DashboardDistributor = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { sortedOrders, summaryCards } = useDashboardData();

    const { handleNavigation } = useNavigation(distributorMenuItems);

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Dashboard"
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
            onNavigate={handleNavigation}
        >
            <DashboardWelcomeHeader icon={IconWelcome} title="Selamat Datang Di Dashboard Anda" />

            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                <DashboardSummary cards={summaryCards} />
                <h2 className="text-lg font-semibold mb-4 mt-6">Status Pengiriman Terbaru</h2>
                <ShippingStatusTable orders={sortedOrders} />
            </div>
        </Layout>
    );
};

export default DashboardDistributor;
