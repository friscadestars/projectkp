import { useParams } from 'react-router-dom';
import { useOrder } from '../../../Context/OrderContext';

export const useOrderDetail = () => {
    const { orderId } = useParams();
    const { orders } = useOrder();
    const order = orders.find(o => o.orderId === orderId);

    return { orderId, order };
};
