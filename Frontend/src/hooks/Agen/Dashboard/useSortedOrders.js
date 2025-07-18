// hooks/Agen/useSortedOrders.js
export const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
};

export const getRecentSortedOrders = (orders) => {
    const recentOrders = orders.filter(order => order.status === 'Tertunda');
    return [...recentOrders].sort((a, b) => {
        const dateA = parseDate(a.orderDate);
        const dateB = parseDate(b.orderDate);
        if (dateA.getTime() !== dateB.getTime()) return dateB - dateA;
        const idA = parseInt(a.orderId.split('-')[1]);
        const idB = parseInt(b.orderId.split('-')[1]);
        return idB - idA;
    });
};
