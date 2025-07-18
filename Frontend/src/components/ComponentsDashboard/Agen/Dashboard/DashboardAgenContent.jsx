// src/Components/ComponentsDashboard/Agen/Dashboard/DashboardAgenContent.jsx
import React from 'react';
import DashboardWelcomeHeader from '../../Common/PageHeader';
import DashboardSummary from '../../Card/DashboardSummary';
import RecentOrders from './RecentOrders';
import IconWelcome from '../../../../assets/IconHeader/IconWelcome.png';
import { useOrder } from '../../../../Context/OrderContext';

const DashboardAgenContent = () => {
    const { orders } = useOrder();

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
        <>
            <DashboardWelcomeHeader icon={IconWelcome} title="Selamat Datang Di Dashboard Anda" />
            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                <DashboardSummary
                    cards={[
                        { title: 'Total Order', value: orders.length },
                        { title: 'Pesanan Tertunda', value: recentOrders.length },
                        { title: 'Pesanan Dikirim', value: orders.filter(o => o.status === 'Dikirim').length }
                    ]}
                />
                <RecentOrders orders={sortedOrders} />
            </div>
        </>
    );
};

export default DashboardAgenContent;
