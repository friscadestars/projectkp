import React, { useState, useEffect } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { distributorMenuItems } from '../../components/ComponentsDashboard/Constants/menuItems';
import iconValidasi from '../../assets/IconHeader/ValidasiIcon.png';
import ValidasiOrderSection from '../../components/ComponentsDashboard/Distributor/ValidasiOrder/ValidasiOrderSection';
import PageHeaderWithIcon from '../../components/ComponentsDashboard/Common/PageHeader';
import { useNavigation } from '../../hooks/useNavigation';
import { fetchOrders, updateOrderStatus } from '../../services/ordersApi';

const ValidasiOrder = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation(distributorMenuItems);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const allOrders = await fetchOrders();
                setOrders(allOrders.filter(o =>
                    o.status === 'pending' || o.status === 'processing'
                ));
            } catch (e) {
                setErr(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleTerima = async (orderId) => {
        try {
            await updateOrderStatus(orderId, 'approved');
            setOrders(prev => prev.filter(o => o.orderId !== orderId));
            Swal.fire('Berhasil', 'Order disetujui dan siap dikirim ke pabrik.', 'success');
        } catch (e) {
            Swal.fire('Gagal', 'Gagal menyetujui order: ' + e.message, 'error');
        }
    };

    const handleTolak = async (orderId) => {
        try {
            await updateOrderStatus(orderId, 'cancelled');
            setOrders(prev => prev.filter(o => o.orderId !== orderId));
        } catch (e) {
            alert('Gagal menolak order: ' + e.message);
        }
    };

    if (loading) return <div>Memuat...</div>;
    if (err) return <div className="text-red-500">Error: {err}</div>;

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Validasi Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
            role="distributor"
        >
            <PageHeaderWithIcon icon={iconValidasi} title="Validasi Order" />
            <ValidasiOrderSection
                orders={orders}
                handleTerima={handleTerima}
                handleTolak={handleTolak}
            />
        </Layout>
    );
};

export default ValidasiOrder;
