import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useOrder } from '../../Context/OrderContext.jsx';
import iconValidasi from '../../assets/IconHeader/ValidasiIcon.png';
import ValidasiOrderSection from '../../Components/ComponentsDashboard/Distributor/ValidasiOrder/ValidasiOrderSection.jsx';
import PageHeaderWithIcon from '../../Components/ComponentsDashboard/Common/PageHeader';
import { useNavigation } from '../../hooks/useNavigation';

const ValidasiOrder = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation(distributorMenuItems);
    const { orders } = useOrder();

    const pendingOrders = orders.filter(order => order.status === 'Tertunda');

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Validasi Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
        >
            <PageHeaderWithIcon icon={iconValidasi} title="Validasi Order" />
            <ValidasiOrderSection orders={pendingOrders} />
        </Layout>
    );
};

export default ValidasiOrder;
