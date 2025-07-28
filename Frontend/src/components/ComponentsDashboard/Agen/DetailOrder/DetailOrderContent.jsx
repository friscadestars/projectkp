import React from 'react';
import DetailOrderInfo from './DetailOrderInfo';
import RincianProdukTable from './RincianProdukTable';

const DetailOrderContent = ({ order, titleText, icon }) => {
    if (!order || !Array.isArray(order.products)) {
        return (
            <div className="detail-order-error p-4 text-center text-red-500">

            </div>
        );
    }

    return (
        <>
            <div className="detail-order-header">
                <img src={icon} alt="Icon" className="detail-order-icon" />
                <h1 className="detail-order-title">{titleText}</h1>
            </div>

            <div className="detail-order-container max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <DetailOrderInfo order={order} />
                <RincianProdukTable
                    products={order.products}
                    status={order.status}
                />
            </div>
        </>
    );
};

export default DetailOrderContent;
