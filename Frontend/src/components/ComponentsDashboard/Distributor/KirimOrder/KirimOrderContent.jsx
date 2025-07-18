import React from 'react';
import OrderInfoTable from '../OrderDetailTable';
import ProductDetailTable from '../ValidasiOrder/ProductDetailTable';
import SendOrderButton from '../../../Common/SendOrderButton';

const KirimOrderLayout = ({ order }) => {
    return (
        <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6">
            <OrderInfoTable order={order} />
            <ProductDetailTable products={order.products} />
            <SendOrderButton orderId={order.orderId} />
        </div>
    );
};

export default KirimOrderLayout;
