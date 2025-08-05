import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { pabrikMenuItems } from '../../components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import MonitoringDistributorContent from '../../components/ComponentsDashboard/Pabrik/5_Monitoring/MonitoringDistributorContent';
import { useMonitoringDistributorPage } from "../../hooks/Pabrik/useMonitoringDistributor";
import EditDistributorModal from '../../components/ComponentsDashboard/Pabrik/5_Monitoring/EditDistributorModal';

const MonitoringDistributor = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigation = useNavigation(pabrikMenuItems);
  const page = useMonitoringDistributorPage();

  return (
    <>
      <Layout
        menuItems={pabrikMenuItems}
        activeLabel="Monitoring Distributor"
        onNavigate={navigation.handleNavigation}
        showDropdown={showDropdown}
        toggleDropdown={() => setShowDropdown(prev => !prev)}
        role="pabrik"
      >
        <MonitoringDistributorContent
          searchTerm={page.searchTerm}
          setSearchTerm={page.setSearchTerm}
          filteredDistributorList={page.filteredDistributorList}
          toggleAktif={page.toggleAktif}
        />
      </Layout>

      {page.showEditModal && page.selectedDistributor && (
        <EditDistributorModal
          distributor={page.selectedDistributor}
          onClose={() => page.setShowEditModal(false)}
          onSave={page.handleSaveEdit}
        />
      )}
    </>
  );
};

export default MonitoringDistributor;
