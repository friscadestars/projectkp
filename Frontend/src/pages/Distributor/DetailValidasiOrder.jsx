import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import ValidasiOrderContent from '../../components/ComponentsDashboard/Distributor/ValidasiOrder/DetailOrderContent';
import { useValidasiOrderPage } from '../../hooks/Distributor/ValidasiOrder/useValidasiOrderPage';

const DetailValidasiOrder = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(prev => !prev);

    const props = useValidasiOrderPage();

    return (
        <Layout
            {...props.layoutProps}
            showDropdown={showDropdown}
            toggleDropdown={toggleDropdown}
            role="distributor"
        >
            <ValidasiOrderContent {...props} loading={props.loading} />
        </Layout>
    );
};


export default DetailValidasiOrder;
