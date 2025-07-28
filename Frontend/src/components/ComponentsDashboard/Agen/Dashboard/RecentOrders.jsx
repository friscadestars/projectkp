import React from 'react';
import OrderTable from './OrderTable';

const RecentOrders = ({ orders }) => (
  <section className="mt-6">
    <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4">
      Pesanan Terbaru
    </h2>

    <div className="max-w-8xl w-full mx-auto overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm px-4 sm:px-6 lg:px-8 py-6">
      <OrderTable orders={orders} showAction={false} />
    </div>
  </section>
);

export default RecentOrders;
