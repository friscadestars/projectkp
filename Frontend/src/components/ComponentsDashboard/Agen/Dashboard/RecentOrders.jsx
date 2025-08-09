import React from 'react';
import OrderTable from './OrderTable';

const RecentOrders = ({ orders }) => (
  <section className="mt-5 sm:mt-6">
    <h2 className="text-sm sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
      Pesanan Terbaru
    </h2>

    <div className="max-w-full w-full mx-auto overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
      <OrderTable orders={orders} showAction={false} />
    </div>
  </section>
);

export default RecentOrders;
