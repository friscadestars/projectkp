// src/hooks/Agen/useDetailOrderPage.js
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../../useNavigation';
import { getOrderPageInfo } from '../../../utils/Agen/InfoDetailOrder';
import { agenMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';

export const useDetailOrderPage = () => {
    const location = useLocation();
    const { order, from } = location.state || {};

    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation(agenMenuItems);
    const { titleText, icon, activeLabel } = getOrderPageInfo(from);

    return {
        order,
        titleText,
        icon,
        activeLabel,
        showDropdown,
        toggleDropdown: () => setShowDropdown(prev => !prev),
        handleNavigation,
        agenMenuItems 
    };
};
