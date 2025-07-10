import React from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import OrderHistoryTable from '../../Components/ComponentsDashboard/Agen/Table/OrderHistoryTable';
import FilterBarRiwayat from '../../Components/ComponentsDashboard/Distributor/RiwayatOrder/FilterBarRiwayat';
import PageHeaderWithIcon from '../../Components/ComponentsDashboard/Common/PageHeader';
import useRiwayatOrder from '../../hooks/Agen/useRiwayatOrder';
import { agenMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import Iconriwayat from '../../assets/IconHeader/IconRiwayat.png';

const RiwayatOrder = () => {
    const {
        showDropdown,
        setShowDropdown,
        handleNavigation,
        handleDelete,
        handleDetail,
        completedOrders
    } = useRiwayatOrder();

    return (
        <AgenLayout
            menuItems={agenMenuItems}
            activeLabel="Riwayat Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(!showDropdown)}
        >
            <PageHeaderWithIcon icon={Iconriwayat} title="Riwayat Order" />

            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 mb-6">
                <FilterBarRiwayat />

                <div className="mt-4">
                    <OrderHistoryTable
                        orders={completedOrders}
                        onDelete={handleDelete}
                        onDetail={handleDetail}
                    />
                </div>
            </div>
        </AgenLayout>
    );
};

export default RiwayatOrder;
