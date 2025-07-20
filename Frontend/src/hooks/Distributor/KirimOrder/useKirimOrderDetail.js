import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../../../Context/OrderContext.jsx';
import { distributorMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';

export const useKirimOrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders } = useOrder();

    const order = orders.find(o => o.orderId === orderId);

    const handleNavigation = (label) => {
        const mainItem = distributorMenuItems.find(item => item.label === label);
        const subItem = distributorMenuItems.flatMap(item => item.subItems || []).find(sub => sub.label === label);

        if (label === 'Logout') {
            alert('Logout berhasil!');
            navigate('/');
        } else if (mainItem?.path) {
            navigate(mainItem.path);
        } else if (subItem?.path) {
            navigate(subItem.path);
        }
    };

    return { order, orderId, handleNavigation };
};
