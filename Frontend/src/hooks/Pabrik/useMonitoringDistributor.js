import { useState } from 'react';
import { useOrderPabrik } from '../../Context/OrderContextPabrik';
import { pabrikMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../useNavigation';

export const useMonitoringDistributor = () => {
  const { orders = [] } = useOrderPabrik();
  const [searchTerm, setSearchTerm] = useState('');
  const { handleNavigation } = useNavigation(pabrikMenuItems);

  // Filter order berdasarkan nama distributor atau ID agen
  const filteredOrders = orders.filter(order =>
    order.distributor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.agentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Log hasil filter untuk debugging
  console.log('Filtered Orders:', filteredOrders);

  return {
    searchTerm,
    setSearchTerm,
    filteredOrders,
    handleNavigation
  };
};
