import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import DetailOrderContent from '../../components/ComponentsDashboard/Agen/DetailOrder/DetailOrderContent';
import IconRiwayat from '../../assets/IconHeader/IconRiwayat.png';
import { agenMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { fetchOrderById } from '../../services/ordersApi';

const DetailRiwayatOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = React.useState(false);

    const labelToPath = (label) => {
        for (const item of agenMenuItems) {
            if (item.label === label) return item.path;
            if (item.subItems) {
                const sub = item.subItems.find(sub => sub.label === label);
                if (sub) return sub.path;
            }
        }
        return '/';
    };

    const toggleDropdown = () => setShowDropdown(prev => !prev);
    const handleNavigation = (label) => {
        const path = labelToPath(label);
        navigate(path);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchOrderById(orderId);
                setOrder(data);
            } catch (err) {
                console.error('Gagal mengambil data order:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orderId]);

    return (
        <Layout
            menuItems={agenMenuItems}
            activeLabel="Riwayat Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={toggleDropdown}
            role="agen"
        >
            {loading ? (
                <p className="p-4 text-gray-600">Memuat data...</p>
            ) : (
                <DetailOrderContent
                    order={order}
                    titleText="Detail Riwayat Order"
                    icon={IconRiwayat}
                    mode="riwayat"
                />
            )}
        </Layout>
    );
};

export default DetailRiwayatOrder;
