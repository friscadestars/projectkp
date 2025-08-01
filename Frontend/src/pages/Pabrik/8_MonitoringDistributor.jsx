import React, { useState, useEffect } from "react";
import Layout from "../../Components/ComponentsDashboard/Layout/Layout";
import { pabrikMenuItems } from "../../Components/ComponentsDashboard/Constants/menuItems";
import PageHeader from "../../components/ComponentsDashboard/Common/PageHeader";
import TabelMonitoringDistributor from "../../components/ComponentsDashboard/Pabrik/5_Monitoring/TabelMonitoringDistributor";
import iconMonitoring from "../../assets/IconHeader/MonitoringIcon.png";
import { useMonitoringDistributor } from "../../hooks/Pabrik/useMonitoringDistributor";
import SearchInput from '../../components/ComponentsDashboard/Common/SearchInput.jsx';
import { OrderPabrikProvider } from '../../Context/OrderContextPabrik';
import { useNavigation } from '../../hooks/useNavigation';
import EditDistributorModal from '../../components/ComponentsDashboard/Pabrik/5_Monitoring/EditDistributorModal';
import { updateDistributor } from '../../services/pabrik/UserDistributorApi.js';


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

  const [localOrders, setLocalOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState(null); // ⬅️ Tambah ini

  useEffect(() => {
    setLocalOrders(filteredOrders);
  }, [filteredOrders]);

  const toggleAktif = (id) => {
    setLocalOrders(prev =>
      prev.map(item =>
        item.distributorId === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  // ✅ Handle klik tombol Edit
  const handleEdit = (distributor) => {
    setSelectedDistributor(distributor); // ⬅️ Kirim semua data distributor ke modal
    setShowModal(true);
  };

  const handleSave = async (updatedData) => {
    try {
      const token = localStorage.getItem('token'); // Ambil token auth

      if (!token) {
        console.error("Token tidak ditemukan.");
        return;
      }

      const res = await updateDistributor(updatedData.distributorId, {
        name: updatedData.distributor,
        email: updatedData.email,
        no_telp: updatedData.noTelepon,
        rekening: updatedData.noRek,
        nama_rekening: updatedData.namaRekening,
        nama_bank: updatedData.namaBank,
        alamat: updatedData.address
      }, token);

      // Update state lokal jika API berhasil
      const updatedList = localOrders.map(d =>
        d.distributorId === updatedData.distributorId ? updatedData : d
      );
      setLocalOrders(updatedList);
      setShowModal(false);
    } catch (err) {
      console.error("Gagal update distributor:", err.message);
    }
  };


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
        <TabelMonitoringDistributor
          orders={localOrders}
          toggleAktif={toggleAktif}
          onEditClick={handleEdit}
        />
      </div>

      {showModal && selectedDistributor && (
        <EditDistributorModal
          distributor={selectedDistributor}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
};

export default MonitoringDistributor;
