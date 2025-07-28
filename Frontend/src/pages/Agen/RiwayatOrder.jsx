import React from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeaderWithIcon from '../../components/ComponentsDashboard/Common/PageHeader';
import FilterBarRiwayat from '../../components/ComponentsDashboard/Common/FilterBarRiwayat';
import OrderHistoryTable from '../../components/ComponentsDashboard/Agen/RiwayatOrder/OrderHistoryTable';
import { useRiwayatOrderPage } from '../../hooks/Agen/Riwayat/useRiwayatOrderPage';

const RiwayatOrder = () => {
    const props = useRiwayatOrderPage();
    const { loading, error } = props;

    return (
        <AgenLayout {...props.layoutProps} role="agen">
            <PageHeaderWithIcon {...props.pageHeaderProps} />

            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 mb-6">
                <FilterBarRiwayat />
                <div className="mt-4">
                    {loading ? (
                        <div className="text-center py-4 text-gray-500">Memuat data...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-4">
                            {error.message || 'Terjadi kesalahan saat memuat data'}
                        </div>
                    ) : (
                        <OrderHistoryTable {...props.orderTableProps} />
                    )}
                </div>
            </div>
        </AgenLayout>
    );
};

export default RiwayatOrder;
