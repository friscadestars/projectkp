import React, { useState } from "react";
import Layout from "../../Components/ComponentsDashboard/Layout/Layout";
import { pabrikMenuItems } from "../../Components/ComponentsDashboard/Constants/menuItems";
import PageHeader from "../../components/ComponentsDashboard/Common/PageHeader";
import TabelMonitoringDistributor from "../../components/ComponentsDashboard/Pabrik/5_Monitoring/TabelMonitoringDistributor";
import iconMonitoring from "../../assets/IconHeader/MonitoringIcon.png";
import { useMonitoringDistributor } from "../../hooks/Pabrik/useMonitoringDistributor";
import SearchInput from '../../components/ComponentsDashboard/Common/SearchInput.jsx';
import { OrderPabrikProvider } from '../../Context/OrderContextPabrik';
import { useNavigation } from '../../hooks/useNavigation';

const MonitoringDistributor = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { handleNavigation } = useNavigation(pabrikMenuItems);

  return (
    <OrderPabrikProvider>
      <MonitoringDistributorContent
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        onNavigate={handleNavigation}
      />
    </OrderPabrikProvider>
  );
};

const MonitoringDistributorContent = ({ showDropdown, setShowDropdown, onNavigate }) => {
  const {
    searchTerm,
    setSearchTerm,
    filteredOrders,
  } = useMonitoringDistributor();

  return (
    <Layout
      menuItems={pabrikMenuItems}
      activeLabel="Monitoring Distributor"
      onNavigate={onNavigate}
      showDropdown={showDropdown}
      toggleDropdown={() => setShowDropdown((prev) => !prev)}
    >
      <PageHeader icon={iconMonitoring} title="Monitoring Distributor" />

      <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TabelMonitoringDistributor orders={filteredOrders} />
      </div>
    </Layout>
  );
};

export default MonitoringDistributor;
