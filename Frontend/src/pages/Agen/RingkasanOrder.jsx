// src/Pages/Agen/RingkasanOrder.jsx
import React from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import OrderTableRingkasan from '../../Components/ComponentsDashboard/Agen/Table/OrderTableRingkasan';
import ConfirmationModal from '../../Components/ComponentsDashboard/Agen/Modal/ConfirmationModal';
import PageHeaderWithIcon from '../../Components/ComponentsDashboard/Common/PageHeader';
import SearchInput from '../../Components/ComponentsDashboard/Common/SearchInput';
import truckIcon from '../../assets/IconHeader/IconTruck.png';
import { agenMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import useRingkasanOrder from '../../hooks/Agen/useRingkasanOrder';

const RingkasanOrder = () => {
    const {
        searchTerm, setSearchTerm,
        showDropdown, setShowDropdown,
        showModal, filteredOrders,
        handleNavigation, handleDetail,
        handleConfirm, confirmReceipt,
        cancelReceipt, getStatusClasses,
        getEstimatedDate
    } = useRingkasanOrder();

    return (
        <Layout
            menuItems={agenMenuItems}
            activeLabel="Ringkasan Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(!showDropdown)}
        >
            <PageHeaderWithIcon icon={truckIcon} title="Ringkasan Order" />

            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <OrderTableRingkasan
                    orders={filteredOrders}
                    onDetail={handleDetail}
                    onConfirm={handleConfirm}
                    getStatusClasses={getStatusClasses}
                    getEstimatedDate={getEstimatedDate}
                />
            </div>

            {showModal && (
                <ConfirmationModal onConfirm={confirmReceipt} onCancel={cancelReceipt} />
            )}
        </Layout>
    );
};

export default RingkasanOrder;
