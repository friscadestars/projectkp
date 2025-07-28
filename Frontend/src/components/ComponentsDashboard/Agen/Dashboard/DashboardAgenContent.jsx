// src/Components/ComponentsDashboard/Agen/Dashboard/DashboardAgenContent.jsx
import React from 'react';
import DashboardWelcomeHeader from '../../Common/PageHeader';
import DashboardSummary from '../../Card/DashboardSummary';
import RecentOrders from './RecentOrders';
import IconWelcome from '../../../../assets/IconHeader/IconWelcome.png';


const DashboardAgenContent = ({ orders, loading, error, stats, recentOrders }) => {
    if (loading) {
        return (
            <>
                <DashboardWelcomeHeader icon={IconWelcome} title="Selamat Datang Di Dashboard Anda" />
                <div className="bg-white border border-gray-200 shadow-md rounded-lg px-4 sm:px-6 py-4 sm:py-6 mt-4">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3" />
                        <div className="h-24 bg-gray-200 rounded" />
                        <div className="h-56 bg-gray-200 rounded" />
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <DashboardWelcomeHeader icon={IconWelcome} title="Selamat Datang Di Dashboard Anda" />
                <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 mt-4 text-red-500">
                    {error.message || 'Terjadi kesalahan saat memuat data.'}
                </div>
            </>
        );
    }

    return (
        <>
            <DashboardWelcomeHeader icon={IconWelcome} title="Selamat Datang Di Dashboard Anda" />
            <div className="bg-white border border-gray-200 shadow-md rounded-lg px-4 sm:px-6 py-4 sm:py-6 mt-4">
                <DashboardSummary
                    cards={[
                        { title: 'Total Order', value: stats.total },
                        { title: 'Pesanan Tertunda', value: stats.pending },
                        { title: 'Pesanan Dikirim', value: stats.shipped },
                    ]}
                />
                <RecentOrders orders={recentOrders} />
            </div>
        </>
    );
};

export default DashboardAgenContent;
