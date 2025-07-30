import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { pabrikMenuItems } from '../../components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import PageHeader from '../../components/ComponentsDashboard/Common/PageHeader';
import TabelRiwayatDetail from '../../components/ComponentsDashboard/Pabrik/4_Riwayat/TabelRiwayatDetail';
import iconRiwayat from '../../assets/IconHeader/IconRiwayat.png';

const DetailRiwayat = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { handleNavigation } = useNavigation(pabrikMenuItems);

  const { state } = useLocation();
  const { order } = state || {};

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Data order tidak ditemukan.</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 bg-btn-primary text-white px-4 py-2 rounded"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <Layout
      menuItems={pabrikMenuItems}
      activeLabel="Riwayat Pengiriman"
      onNavigate={handleNavigation}
      showDropdown={showDropdown}
      toggleDropdown={() => setShowDropdown((prev) => !prev)}
    >
      <PageHeader icon={iconRiwayat} title={`Detail Order ${order.orderId}`} />

      <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
        <TabelRiwayatDetail order={order} />
      </div>
    </Layout>
  );
};

export default DetailRiwayat;
