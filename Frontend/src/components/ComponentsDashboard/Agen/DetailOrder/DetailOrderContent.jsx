// src/Components/ComponentsDashboard/Agen/Detail/DetailOrderContent.jsx
import React from 'react';
import DetailOrderInfo from './DetailOrderInfo';
import RincianProdukTable from './RincianProdukTable';

const DetailOrderContent = ({ order, titleText, icon }) => {
    if (!order) {
        return <div className="detail-order-error">Order tidak ditemukan.</div>;
    }

    return (
        <>
            <div className="detail-order-header">
                <img src={icon} alt="Icon" className="detail-order-icon" />
                <h1 className="detail-order-title">{titleText}</h1>
            </div>

            <div className="detail-order-container">
                <DetailOrderInfo order={order} />
                <RincianProdukTable products={order.products} status={order.status} />
            </div>
        </>
    );
};

export default DetailOrderContent;
