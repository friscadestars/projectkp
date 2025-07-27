import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { distributorMenuItems } from '../../components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import MonitoringAgenContent from '../../components/ComponentsDashboard/Distributor/Monitoring/MonitoringAgen/MonitoringAgenContent';
import { useMonitoringAgenPage } from '../../hooks/Distributor/Monitoring/useMonitoringAgenPage';
import EditAgenModal from '../../components/ComponentsDashboard/Distributor/Monitoring/MonitoringAgen/EditAgenModal';

const MonitoringAgen = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigation = useNavigation(distributorMenuItems);
    const page = useMonitoringAgenPage();

    return (
        <>
            <Layout
                menuItems={distributorMenuItems}
                activeLabel="Monitoring Agen"
                onNavigate={navigation.handleNavigation}
                showDropdown={showDropdown}
                toggleDropdown={() => setShowDropdown(prev => !prev)}
                role="distributor"
            >
                <MonitoringAgenContent
                    searchTerm={page.searchTerm}
                    setSearchTerm={page.setSearchTerm}
                    filteredAgenList={page.filteredAgenList}
                    toggleAktif={page.toggleAktif}
                />
            </Layout>

            {page.showEditModal && page.selectedAgen && (
                <EditAgenModal
                    agen={page.selectedAgen}
                    onClose={() => page.setShowEditModal(false)}
                    onSave={page.handleSaveEdit}
                />
            )}
        </>
    );
};

export default MonitoringAgen;
