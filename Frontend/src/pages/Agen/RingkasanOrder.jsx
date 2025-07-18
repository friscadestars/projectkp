import React from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeaderWithIcon from '../../components/ComponentsDashboard/Common/PageHeader';
import SearchInput from '../../Components/ComponentsDashboard/Common/SearchInput';
import OrderTableRingkasan from '../../components/ComponentsDashboard/Agen/RingkasanOrder/OrderTableRingkasan';
import { useRingkasanOrderPage } from '../../hooks/Agen/RingkasanOrder/useRingkasanOrderPage';

const RingkasanOrder = () => {
    const props = useRingkasanOrderPage();

    return (
        <Layout {...props.layoutProps}
        role="agen" 
        >
            <PageHeaderWithIcon {...props.pageHeaderProps} />
            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                <SearchInput {...props.searchInputProps} />
                <OrderTableRingkasan {...props.orderTableProps} />
            </div>
        </Layout>
    );
};

export default RingkasanOrder;
