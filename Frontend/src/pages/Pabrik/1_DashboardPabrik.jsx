import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout.jsx';
import { pabrikMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems.js';
import { useDashboardPabrik } from '../../hooks/Pabrik/useDashboardPabrik.js';
import { useNavigation } from '../../hooks/useNavigation.js';
import DashboardWelcomeHeader from '../../components/ComponentsDashboard/Common/PageHeader.jsx';
import DashboardSummary from '../../Components/ComponentsDashboard/Card/DashboardSummary.jsx';
import TableDaftarPengirimanAktif from '../../Components/ComponentsDashboard/Pabrik/Dashboard/TableDaftarPengirimanAktif.jsx';
import IconWelcome from '../../assets/IconHeader/IconWelcome.png';

const DashboardPabrik = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { sortedOrders, summaryCards } = useDashboardPabrik();

    const { handleNavigation } = useNavigation(pabrikMenuItems);

    return (
        <Layout
            menuItems={pabrikMenuItems}
            activeLabel="Dashboard"
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
            onNavigate={handleNavigation}
        >
            <DashboardWelcomeHeader icon={IconWelcome} className="w-13 h-15" title="Selamat Datang Di Dashboard Anda" />

            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                <DashboardSummary cards={summaryCards} />
                <TableDaftarPengirimanAktif orders={sortedOrders} />
            </div>
        </Layout>
    );
};

export default DashboardPabrik;
