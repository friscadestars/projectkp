import React from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeader from '../../Components/ComponentsDashboard/Common/PageHeader';
import TabelRiwayatPengiriman from '../../components/ComponentsDashboard/Pabrik/4_Riwayat/TabelRiwayatPengiriman';
import { OrderPabrikProvider } from '../../Context/OrderContextPabrik';
import { pabrikMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import iconRiwayat from '../../assets/IconHeader/IconRiwayat.png';

const RiwayatPengiriman = () => {
    const { handleNavigation } = useNavigation(pabrikMenuItems);

    return (
        <OrderPabrikProvider>
            <Layout
                menuItems={pabrikMenuItems}
                activeLabel="Riwayat Pengiriman"
                onNavigate={handleNavigation}
            >
                <PageHeader
                    icon={iconRiwayat}
                    title="Riwayat Pengiriman"
                />
                <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                    {/* <FilterBarRiwayat /> */}
                    <TabelRiwayatPengiriman />
                </div>
            </Layout>
        </OrderPabrikProvider>
    );
};

export default RiwayatPengiriman;
