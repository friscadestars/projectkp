import React from 'react';
import OrderInfoTable from '../OrderInfoTable';
import ProdukDetailTable from '../ProdukDetailTable';
import ValidasiActions from '../ValidasiActions';

const DetailValidasiOrderLayout = ({
    order,
    inputPrices,
    handleSetHarga,
    handleTerima,
    handleTolak
}) => {
    return (
        <>
            <OrderInfoTable order={order} />
            <ProdukDetailTable
                products={order.products}
                inputPrices={inputPrices}
                handleSetHarga={handleSetHarga}
            />
            <ValidasiActions
                handleTerima={handleTerima}
                handleTolak={handleTolak}
            />
        </>
    );
};

export default DetailValidasiOrderLayout;
