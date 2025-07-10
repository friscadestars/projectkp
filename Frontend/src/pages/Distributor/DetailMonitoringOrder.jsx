import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import FormTitle from '../../Components/ComponentsDashboard/Common/PageHeader';
import OrderDetailTable from '../../Components/ComponentsDashboard/Distributor/Monitoring/OrderDetailTable';
import ProductSummaryTable from '../../Components/ComponentsDashboard/Distributor/Monitoring/ProductSummaryTable';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useOrderDetail } from '../../hooks/Distributor/useOrderDetail';
import { useNavigation } from '../../hooks/useNavigation';
import OrderAndProductLayout from '../../Components/ComponentsDashboard/Common/OrderAndProductLayout';
import iconMonitoring from '../../assets/IconHeader/MonitoringIcon.png';

const DetailMonitoringOrder = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { order } = useOrderDetail();
    const { handleNavigation } = useNavigation(distributorMenuItems);

    if (!order) return <div className="p-8 text-red-500">Order tidak ditemukan.</div>;

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Monitoring Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(!showDropdown)}
        >
            <FormTitle icon={iconMonitoring} title="Monitoring Order" />
            <OrderAndProductLayout
                order={order}
                products={order.products}
                OrderTableComponent={OrderDetailTable}
                ProductTableComponent={ProductSummaryTable}
            />
        </Layout>
    );
};

export default DetailMonitoringOrder;
