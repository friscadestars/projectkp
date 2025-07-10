import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import truckIcon from '../../assets/IconHeader/IconTruck.png';
import iconRiwayat from '../../assets/IconHeader/IconRiwayat.png';
import { agenMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import DetailOrderInfo from '../../Components/ComponentsDashboard/Agen/Table/DetailOrderInfo';
import RincianProdukTable from '../../Components/ComponentsDashboard/Agen/Table/RincianProdukTable';
import { useNavigation } from '../../hooks/useNavigation';

const DetailOrder = () => {
    const location = useLocation();
    const { order, from } = location.state || {};
    const [showDropdown, setShowDropdown] = useState(false);

    const { handleNavigation } = useNavigation(agenMenuItems);

    if (!order) {
        return <div className="p-8 text-red-500">Order tidak ditemukan.</div>;
    }

    const titleText = from === 'riwayat' ? 'Detail Riwayat Order' : 'Ringkasan Order';
    const icon = from === 'riwayat' ? iconRiwayat : truckIcon;
    const activeLabel = from === 'riwayat' ? 'Riwayat Order' : 'Ringkasan Order';

    return (
        <Layout
            menuItems={agenMenuItems}
            activeLabel={activeLabel}
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
        >
            <div className="flex items-center gap-4 mb-6">
                <img src={icon} alt="Icon" className="w-8 h-8" />
                <h1 className="text-xl font-semibold text-blue-900">{titleText}</h1>
            </div>

            <div className="bg-white border-2 border-gray-200 shadow-lg rounded-xl p-6 max-w-9xl mx-auto space-y-6">
                <DetailOrderInfo order={order} />
                <RincianProdukTable products={order.products} status={order.status} />
            </div>
        </Layout>
    );
};

export default DetailOrder;
