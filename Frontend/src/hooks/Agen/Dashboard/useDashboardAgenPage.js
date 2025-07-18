import { useState } from 'react';
import { useNavigation } from '../../useNavigation';
import { agenMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';

export const useDashboardAgenPage = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation(agenMenuItems);

    return {
        layoutProps: {
            menuItems: agenMenuItems,
            activeLabel: 'Dashboard',
            onNavigate: handleNavigation,
            showDropdown,
            toggleDropdown: () => setShowDropdown(prev => !prev)
        }
    };
};
