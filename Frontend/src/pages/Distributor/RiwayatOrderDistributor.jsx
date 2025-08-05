import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeader from '../../components/ComponentsDashboard/Common/PageHeader';
import RiwayatOrderSection from '../../components/ComponentsDashboard/Distributor/RiwayatOrder/RiwayatOrderContent'; // gabungan
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import iconRiwayat from '../../assets/IconHeader/IconRiwayat.png';
import { useRiwayatOrderDistributor } from '../../hooks/Distributor/Riwayat/useRiwayatOrderDistributor';
import { useNavigation } from '../../hooks/useNavigation';

const RiwayatOrderDistributor = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [entries, setEntries] = useState(10);
    const { orders, productPrices, handleDelete } = useRiwayatOrderDistributor();
    const { handleNavigation } = useNavigation(distributorMenuItems);

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Riwayat Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(!showDropdown)}
            role="distributor"
        >
            <PageHeader icon={iconRiwayat} title="Riwayat Order" />
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <RiwayatOrderSection
                    entries={entries}
                    onEntriesChange={setEntries}
                    orders={orders}
                    onDelete={handleDelete}
                    pabrikPrices={productPrices || []}
                />
            </div>
        </Layout>
    );
};

export default RiwayatOrderDistributor;
