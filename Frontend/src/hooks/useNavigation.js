import { useNavigate } from 'react-router-dom';

export const useNavigation = (menuItems) => {
    const navigate = useNavigate();

    const handleNavigation = (label) => {
        const mainItem = menuItems.find(item => item.label === label);
        const subItem = menuItems.flatMap(item => item.subItems || []).find(sub => sub.label === label);

        if (label === 'Logout') {
            alert('Logout berhasil!');
            navigate('/');
        } else if (mainItem?.path) {
            navigate(mainItem.path);
        } else if (subItem?.path) {
            navigate(subItem.path);
        }
    };

    return { handleNavigation };
};
