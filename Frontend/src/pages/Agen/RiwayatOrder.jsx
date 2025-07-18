import React from 'react';
import AgenLayout from '../../components/ComponentsDashboard/Layout/Layout';
import PageHeaderWithIcon from '../../components/ComponentsDashboard/Common/PageHeader';
import FilterBarRiwayat from '../../components/ComponentsDashboard/Common/FilterBarRiwayat';
import OrderHistoryTable from '../../components/ComponentsDashboard/Agen/RiwayatOrder/OrderHistoryTable';
import { useRiwayatOrderPage } from '../../hooks/Agen/Riwayat/useRiwayatOrderPage';

const RiwayatOrder = () => {
    const props = useRiwayatOrderPage();

    return (
        <AgenLayout {...props.layoutProps}>
            <PageHeaderWithIcon {...props.pageHeaderProps} />

            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 mb-6">
                <FilterBarRiwayat />
                <div className="mt-4">
                    <OrderHistoryTable {...props.orderTableProps} />
                </div>
            </div>
        </AgenLayout>
    );
};

export default RiwayatOrder;
