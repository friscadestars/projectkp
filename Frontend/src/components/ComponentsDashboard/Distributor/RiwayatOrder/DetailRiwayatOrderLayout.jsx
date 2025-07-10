import React from 'react';
import OrderInfoTable from './OrderInfoTable';
import ProductDetailTable from './ProductDetailTable';

const DetailRiwayatOrderLayout = ({ order, products }) => {
    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-6">
            <OrderInfoTable order={order} />
            <ProductDetailTable products={products} />
        </div>
    );
};

export default DetailRiwayatOrderLayout;
