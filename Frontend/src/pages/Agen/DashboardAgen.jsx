// src/pages/Agen/DashboardAgen.jsx
import React from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import DashboardAgenContent from '../../components/ComponentsDashboard/Agen/Dashboard/DashboardAgenContent';
import { useDashboardAgenPage } from '../../hooks/Agen/Dashboard/useDashboardAgenPage';

const DashboardAgenPage = () => {
    const {
        layoutProps,
        orders,
        loading,
        error,
        stats,
        recentOrders,
    } = useDashboardAgenPage();

    console.log("ORDERS before passing:", orders);

    return (
        <AgenLayout {...layoutProps} role="agen">
            <DashboardAgenContent
                orders={orders}
                loading={loading}
                error={error}
                stats={stats}
                recentOrders={recentOrders}
            />
        </AgenLayout>
    );
};

export default DashboardAgenPage;
