// src/Components/Agen/Dashboard/RecentOrders.jsx
import React from 'react';
import OrderTable from '../Table/OrderTable';

const RecentOrders = ({ orders }) => (
    <>
        <h2 className="text-lg font-semibold mb-4">Pesanan Terbaru</h2>
        <div className="overflow-x-auto">
            <OrderTable orders={orders} showAction={false} />
        </div>
    </>
);

export default RecentOrders;
