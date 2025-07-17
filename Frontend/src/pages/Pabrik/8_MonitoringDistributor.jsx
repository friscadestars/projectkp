import React, { useState } from "react";
import Layout from "../../Components/ComponentsDashboard/Layout/Layout";
import { pabrikMenuItems } from "../../Components/ComponentsDashboard/Constants/menuItems";
import PageHeader from "../../Components/ComponentsDashboard/Common/PageHeader";
import TabelMonitoringDistributor from "../../components/ComponentsDashboard/Pabrik/5_Monitoring/TabelMonitoringDistributor";
import iconMonitoring from "../../assets/IconHeader/MonitoringIcon.png";
import { useMonitoringDistributor } from "../../hooks/Pabrik/useMonitoringDistributor";
import SearchInput from '../../Components/ComponentsDashboard/Common/SearchInput.jsx';
import { OrderPabrikProvider } from '../../Context/OrderContextPabrik';

const MonitoringDistributor = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <OrderPabrikProvider>
      <MonitoringDistributorContent
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
      />
    </OrderPabrikProvider>
  );
};

const MonitoringDistributorContent = ({ showDropdown, setShowDropdown }) => {
  const {
    searchTerm,
    setSearchTerm,
    filteredOrders,
    handleNavigation,
  } = useMonitoringDistributor();

  return (
    <Layout
      menuItems={pabrikMenuItems}
      activeLabel="Monitoring Distributor"
      onNavigate={handleNavigation}
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
