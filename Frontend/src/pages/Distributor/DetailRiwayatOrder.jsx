// src/pages/Distributor/DetailRiwayatOrder.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import FormTitle from '../../components/ComponentsDashboard/Common/PageHeader';
import { distributorMenuItems } from '../../components/ComponentsDashboard/Constants/menuItems';
import iconRiwayat from '../../assets/IconHeader/IconRiwayat.png';
import DetailRiwayatOrderLayout from '../../components/ComponentsDashboard/Distributor/RiwayatOrder/DetailRiwayatOrderLayout';
import { useNavigation } from '../../hooks/useNavigation';
import { fetchOrderDetailById } from '../../services/ordersApi';

const DetailRiwayatOrder = () => {
    const { handleNavigation } = useNavigation(distributorMenuItems);
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
            menuItems={distributorMenuItems}
            activeLabel="Riwayat Order"
            onNavigate={handleNavigation}
            role="distributor"
        >
            <FormTitle icon={iconRiwayat} title="Riwayat Order" />

            {loading ? (
                <div className="p-4">Memuat data...</div>
            ) : error ? (
                <div className="p-4 text-red-600">{error}</div>
            ) : (
                <DetailRiwayatOrderLayout
                    order={order}
                    titleText="Riwayat Order"
                    icon={iconRiwayat}
                />
            )}
        </Layout>
    );
};

export default DetailRiwayatOrder;
