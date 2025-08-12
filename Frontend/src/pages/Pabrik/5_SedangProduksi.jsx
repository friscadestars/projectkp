import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { pabrikMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import PageHeader from '../../components/ComponentsDashboard/Common/PageHeader';
import TabelDetailSedangDiproduksi from '../../components/ComponentsDashboard/Pabrik/3_ProduksiPengiriman/TabelDetailSedangDiproduksi';
import iconProduksi from '../../assets/IconHeader/IconProduksi.png';

const SedangDiproduksi = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation(pabrikMenuItems);

    const { state } = useLocation();
    const { order } = state || {};

    if (!order) {
        return <div className="p-4">Order tidak ditemukan</div>;
    }

    return (
        <Layout
        menuItems={pabrikMenuItems}
        activeLabel="Produksi & Pengiriman"
        onNavigate={handleNavigation}
        showDropdown={showDropdown}
        toggleDropdown={() => setShowDropdown((prev) => !prev)}
        >
        <PageHeader icon={iconProduksi} title="Produksi & Pengiriman ke Agen" />

        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
            <TabelDetailSedangDiproduksi order={order} />
        </div>
        </Layout>
    );
};

export default SedangDiproduksi;
