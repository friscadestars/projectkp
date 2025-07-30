import React from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import DetailOrderContent from '../../components/ComponentsDashboard/Agen/DetailOrder/DetailOrderContent';
import { useDetailOrderPage } from '../../hooks/Agen/DetailOrder/useDetailOrder';

const DetailOrder = () => {
    const {
        order,
        loading,
        error,
        titleText,
        icon,
        activeLabel,
        showDropdown,
        toggleDropdown,
        handleNavigation,
        agenMenuItems,
    } = useDetailOrderPage();

    return (
        <Layout
            menuItems={agenMenuItems}
            activeLabel={activeLabel}
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={toggleDropdown}
            role="agen"
        >
            {loading ? (
                <p className="p-4 text-center text-gray-500">Memuat data order...</p>
            ) : (
                <DetailOrderContent
                    order={order}
                    error={error}
                    titleText={titleText}
                    icon={icon}
                />
            )}
        </Layout>
    );
};

export default DetailOrder;
