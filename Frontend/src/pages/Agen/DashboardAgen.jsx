import React, { useState } from 'react';

import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import DashboardWelcomeHeader from '../../Components/ComponentsDashboard/Common/PageHeader';
import DashboardSummary from '../../Components/ComponentsDashboard/Card/DashboardSummary';
import RecentOrders from '../../Components/ComponentsDashboard/Agen/Dashboard/RecentOrders';
import IconWelcome from '../../assets/IconHeader/IconWelcome.png';
import { useOrder } from '../../Context/OrderContext';
import { agenMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';

const DashboardAgen = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { orders } = useOrder();
    const { handleNavigation } = useNavigation(agenMenuItems);

    const recentOrders = orders.filter(order => order.status === 'Tertunda');

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    };

    const sortedOrders = [...recentOrders].sort((a, b) => {
        const dateA = parseDate(a.orderDate);
        const dateB = parseDate(b.orderDate);
        if (dateA.getTime() !== dateB.getTime()) return dateB - dateA;
        const idA = parseInt(a.orderId.split('-')[1]);
        const idB = parseInt(b.orderId.split('-')[1]);
        return idB - idA;
    });

    return (
        <AgenLayout
            menuItems={agenMenuItems}
            activeLabel="Dashboard"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(!showDropdown)}
        >
            <DashboardWelcomeHeader icon={IconWelcome} title="Selamat Datang Di Dashboard Anda" />
            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                <DashboardSummary
                    cards={[
                        { title: 'Total Order', value: orders.length },
                        { title: 'Pesanan Tertunda', value: orders.filter(o => o.status === 'Tertunda').length },
                        { title: 'Pesanan Dikirim', value: orders.filter(o => o.status === 'Dikirim').length }
                    ]}
                />
                <RecentOrders orders={sortedOrders} />
            </div>
        </AgenLayout>
    );
};

export default DashboardAgen;
