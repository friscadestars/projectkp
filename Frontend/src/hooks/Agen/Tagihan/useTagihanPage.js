import { useState } from 'react';
import { agenMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../useNavigation';

const useTagihanPage = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { handleNavigation } = useNavigation(agenMenuItems);

    return {
        showDropdown,
        toggleDropdown: () => setShowDropdown(prev => !prev),
        searchTerm,
        setSearchTerm,
        handleNavigation
    };
};

export default useTagihanPage;
