import React from 'react';

const OrderAndProductLayout = ({
    order,
    products,
    OrderTableComponent,
    ProductTableComponent,
    inputPrices, // opsional (untuk validasi)
    handleSetHarga, // opsional (untuk validasi)
}) => {
    return (
        <>
            {OrderTableComponent && <OrderTableComponent order={order} />}
            {ProductTableComponent && (
                <ProductTableComponent
                    products={products}
                    inputPrices={inputPrices}
                    handleSetHarga={handleSetHarga}
                />
            )}
        </>
    );
};

export default OrderAndProductLayout;
