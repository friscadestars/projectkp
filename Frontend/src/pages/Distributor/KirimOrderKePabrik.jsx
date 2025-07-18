import React, { useState } from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import { useKirimOrderPage } from '../../hooks/Distributor/KirimOrder/useKirimOrderPage';
import KirimOrderKePabrikContent from '../../components/ComponentsDashboard/Distributor/KirimOrder/KirimOrderKePabrikContent';

const KirimOrderKePabrik = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(prev => !prev);

    const props = useKirimOrderPage();

    return (
        <AgenLayout
            {...props.layoutProps}
            showDropdown={showDropdown}
            toggleDropdown={toggleDropdown}
        >
            <KirimOrderKePabrikContent {...props} />
        </AgenLayout>
    );
};

export default KirimOrderKePabrik;
