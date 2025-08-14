// src/pages/Pabrik/DetailRiwayat.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { pabrikMenuItems } from '../../components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import PageHeader from '../../components/ComponentsDashboard/Common/PageHeader';
import TabelRiwayatDetail from '../../components/ComponentsDashboard/Pabrik/4_Riwayat/TabelRiwayatDetail';
import iconRiwayat from '../../assets/IconHeader/IconRiwayat.png';
import { fetchOrderDetailById } from '../../services/ordersApi';

const DetailRiwayat = () => {
  const { handleNavigation } = useNavigation(pabrikMenuItems);
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchOrderDetailById(orderId);
        setOrder(result);
      } catch (err) {
        console.error(err);
        setError('Order tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  return (
    <Layout
      menuItems={pabrikMenuItems}
      activeLabel="Riwayat Pengiriman"
      onNavigate={handleNavigation}
    >
      <PageHeader icon={iconRiwayat} title="Riwayat Order" />

      {loading ? (
        <div className="p-4">Memuat data...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
          <TabelRiwayatDetail order={order} />
        </div>
      )}
    </Layout>
  );
};

export default DetailRiwayat;