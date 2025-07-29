import React from 'react';
import DetailOrderInfo from './DetailOrderInfo';
import RincianProdukTable from './RincianProdukTable';

const DetailOrderContent = ({ order, error, titleText, icon, mode = 'ringkasan' }) => {
    if (error) {
        return (
            <div className="p-4 text-center text-red-600">
                {error.message || 'Terjadi kesalahan saat mengambil detail order.'}
            </div>
        );
    }

    if (!order || !Array.isArray(order.products)) {
        return (
            <div className="p-4 text-center text-gray-500 italic">
                Data order tidak tersedia.
            </div>
        );
    }

    return (
        <>
            <div className="detail-order-header">
                <img src={icon} alt="Icon" className="detail-order-icon" />
                <h1 className="detail-order-title">{titleText}</h1>
            </div>

            <div className="detail-order-container max-w-screen-2xl w-full mx-auto px-4 sm:px-8 lg:px-8">
                <DetailOrderInfo order={order} mode={mode} />
                <RincianProdukTable
                    products={order.products}
                    status={order.status}
                />
            </div>
        </>
    );
};

export default DetailOrderContent;
