import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import ValidasiOrderContent from '../../components/ComponentsDashboard/Distributor/ValidasiOrder/DetailOrderContent';
import { useValidasiOrderPage } from '../../hooks/Distributor/ValidasiOrder/useValidasiOrderPage';

const DetailValidasiOrder = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(prev => !prev);

    const props = useValidasiOrderPage();

    if (!props.order) {
        return <div className="p-8 text-red-500">Order tidak ditemukan.</div>;
    }

    return (
        <Layout
            {...props.layoutProps}
            showDropdown={showDropdown}
            toggleDropdown={toggleDropdown}
            role="distributor"
        >
            <ValidasiOrderContent {...props} />
        </Layout>
    );
};

export default DetailValidasiOrder;
