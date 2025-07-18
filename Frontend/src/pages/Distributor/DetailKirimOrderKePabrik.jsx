import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import FormTitle from '../../Components/ComponentsDashboard/Common/PageHeader';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useKirimOrderDetail } from '../../hooks/Distributor/KirimOrder/useKirimOrderDetail';
import iconKirimOrder from '../../assets/IconHeader/KirimOrderIcon.png';
import OrderAndProductLayout from '../../Components/ComponentsDashboard/Common/OrderAndProductLayout';
import OrderInfoTable from '../../Components/ComponentsDashboard/Distributor/KirimOrder/OrderDetailTable';
import ProductDetailTable from '../../Components/ComponentsDashboard/Distributor/KirimOrder/ProductDetailTable';
import SendOrderButton from '../../Components/ComponentsDashboard/Common/SendOrderButton';

const DetailKirimOrderKePabrik = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { order, handleNavigation } = useKirimOrderDetail();

    if (!order) {
        return <div className="p-8 text-red-500">Order tidak ditemukan.</div>;
    }

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Kirim Order ke Pabrik"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
        >
            <FormTitle icon={iconKirimOrder} title="Kirim Orderan ke Pabrik" />

            <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6">
                <OrderAndProductLayout
                    order={order}
                    products={order.products}
                    OrderTableComponent={OrderInfoTable}
                    ProductTableComponent={ProductDetailTable}
                />

                <div className="mt-6">
                    <SendOrderButton orderId={order.orderId} />
                </div>
            </div>
        </Layout>
    );
};

export default DetailKirimOrderKePabrik;
