import React from 'react';
import OrderTable from './OrderTable';

const RecentOrders = ({ orders }) => (
  <section className="mt-6">
    <h2 className="text-lg md:text-xl font-semibold mb-4">Pesanan Terbaru</h2>
    
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      <OrderTable orders={orders} showAction={false} />
    </div>
  </section>
);

export default RecentOrders;
