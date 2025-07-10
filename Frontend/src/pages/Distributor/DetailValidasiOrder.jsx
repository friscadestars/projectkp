import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageTitle from '../../Components/ComponentsDashboard/Common/PageHeader';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useOrder } from '../../Context/OrderContext.jsx';
import iconValidasi from '../../assets/IconHeader/ValidasiIcon.png';
import ValidasiActions from '../../Components/ComponentsDashboard/Distributor/ValidasiOrder/ValidasiActions';
import OrderAndProductLayout from '../../Components/ComponentsDashboard/Common/OrderAndProductLayout';
import OrderInfoTable from '../../Components/ComponentsDashboard/Distributor/ValidasiOrder/OrderInfoTable';
import ProdukDetailTable from '../../Components/ComponentsDashboard/Distributor/ValidasiOrder/ProdukDetailTable';
import { useNavigation } from '../../hooks/useNavigation';

const DetailValidasiOrder = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders, updateProductPrice } = useOrder();
    const { handleNavigation } = useNavigation(distributorMenuItems);

    const order = orders.find(o => o.orderId === orderId);

    const [inputPrices, setInputPrices] = useState(
        order?.products.map(p => ({ name: p.name, price: '' })) || []
    );

    const handleSetHarga = (index, value) => {
        const updated = [...inputPrices];
        updated[index].price = value;
        setInputPrices(updated);
    };

    const handleTerima = () => {
        inputPrices.forEach(p => {
            const numeric = parseInt(p.price);
            if (!isNaN(numeric)) {
                updateProductPrice(orderId, p.name, numeric);
            }
        });
        alert(`Order ${orderId} berhasil disetujui.`);
        navigate('/distributor/validasi-order');
    };

    const handleTolak = () => {
        alert(`Order ${orderId} ditolak.`);
        navigate('/distributor/validasi-order');
    };

    if (!order) {
        return <div className="p-8 text-red-500">Order tidak ditemukan.</div>;
    }

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Validasi Order"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(!showDropdown)}
        >
            <PageTitle icon={iconValidasi} title="Validasi Order" />
            <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6">
                <OrderAndProductLayout
                    order={order}
                    products={order.products}
                    OrderTableComponent={OrderInfoTable}
                    ProductTableComponent={ProdukDetailTable}
                    inputPrices={inputPrices}
                    handleSetHarga={handleSetHarga}
                />

                <ValidasiActions
                    handleTerima={handleTerima}
                    handleTolak={handleTolak}
                />
            </div>
        </Layout>
    );
};

export default DetailValidasiOrder;
