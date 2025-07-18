import React from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import DashboardAgenContent from '../../components/ComponentsDashboard/Agen/Dashboard/DashboardAgenContent';
import { useDashboardAgenPage } from '../../hooks/Agen/Dashboard/useDashboardAgenPage';

const DashboardAgenPage = () => {
    const { layoutProps } = useDashboardAgenPage();

    return (
        <AgenLayout {...layoutProps}>
            <DashboardAgenContent />
        </AgenLayout>
    );
};

export default DashboardAgenPage;
