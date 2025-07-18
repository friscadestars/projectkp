import React, { useState } from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import MonitoringAgenContent from '../../components/ComponentsDashboard/Distributor/Monitoring/MonitoringAgen/MonitoringAgenContent';
import { useMonitoringAgenPage } from '../../hooks/Distributor/Monitoring/useMonitoringAgenPage';

const MonitoringAgen = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigation = useNavigation(distributorMenuItems);
    const page = useMonitoringAgenPage();

    return (
        <AgenLayout
            menuItems={distributorMenuItems}
            activeLabel="Monitoring Agen"
            onNavigate={navigation.handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
        >
            <MonitoringAgenContent
                searchTerm={page.searchTerm}
                setSearchTerm={page.setSearchTerm}
                filteredAgenList={page.filteredAgenList}
                toggleAktif={page.toggleAktif}
            />
        </AgenLayout>
    );
};

export default MonitoringAgen;
