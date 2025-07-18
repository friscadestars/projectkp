import React from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import DetailOrderContent from '../../components/ComponentsDashboard/Agen/DetailOrder/DetailOrderContent';
import { useDetailOrderPage } from '../../hooks/Agen/DetailOrder/useDetailOrder';

const DetailOrder = () => {
    const props = useDetailOrderPage();

    return (
        <Layout
            menuItems={props.agenMenuItems}
            activeLabel={props.activeLabel}
            onNavigate={props.handleNavigation}
            showDropdown={props.showDropdown}
            toggleDropdown={props.toggleDropdown}
        >
            <DetailOrderContent
                order={props.order}
                titleText={props.titleText}
                icon={props.icon}
            />
        </Layout>
    );
};

export default DetailOrder;
