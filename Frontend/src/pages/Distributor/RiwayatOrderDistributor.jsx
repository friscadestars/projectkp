import React, { useState } from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeader from '../../Components/ComponentsDashboard/Common/PageHeader';
import FilterBarRiwayat from '../../Components/ComponentsDashboard/Distributor/RiwayatOrder/FilterBarRiwayat';
import RiwayatOrderTable from '../../Components/ComponentsDashboard/Distributor/RiwayatOrder/RiwayatOrderTable';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import iconRiwayat from '../../assets/IconHeader/IconRiwayat.png';
import { useRiwayatOrderDistributor } from '../../hooks/Distributor/useRiwayatOrderDistributor';
import { useNavigation } from '../../hooks/useNavigation';

const RiwayatOrderDistributor = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { orders, handleDelete } = useRiwayatOrderDistributor();

    const { handleNavigation } = useNavigation(distributorMenuItems);

    return (
        <AgenLayout
            menuItems={distributorMenuItems}
            activeLabel="Riwayat Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(!showDropdown)}
        >
            <PageHeader icon={iconRiwayat} title="Riwayat Order" />
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <FilterBarRiwayat />
                <RiwayatOrderTable orders={orders} onDelete={handleDelete} />
            </div>
        </AgenLayout>
    );
};

export default RiwayatOrderDistributor;
