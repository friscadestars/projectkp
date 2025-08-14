import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeader from '../../components/ComponentsDashboard/Common/PageHeader';
import TabelRiwayatPengiriman from '../../components/ComponentsDashboard/Pabrik/4_Riwayat/TabelRiwayatPengiriman'; // gabungan filter+tabel
import { pabrikMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useRiwayatPengiriman } from '../../hooks/Pabrik/Riwayat/useRiwayatPengiriman';
import { useNavigation } from '../../hooks/useNavigation';
import iconRiwayat from '../../assets/IconHeader/IconRiwayat.png';

const RiwayatPengiriman = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [entries, setEntries] = useState(10);

    const { orders, productPrices, loading } = useRiwayatPengiriman();
    const { handleNavigation } = useNavigation(pabrikMenuItems);

    return (
        <Layout
            menuItems={pabrikMenuItems}
            activeLabel="Riwayat Pengiriman"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(!showDropdown)}
            role="pabrik"
        >
            <PageHeader icon={iconRiwayat} title="Riwayat Pengiriman" />
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <TabelRiwayatPengiriman
                    entries={entries}
                    onEntriesChange={setEntries}
                    orders={orders}
                    pabrikPrices={productPrices || []}
                    loading={loading}
                />
            </div>
        </Layout>
    );
};

export default RiwayatPengiriman;
