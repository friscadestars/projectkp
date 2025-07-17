import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { pabrikMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import IconOrderMasuk from '../../assets/IconHeader/IconOrderMasuk.png';
import TabelDetailOrder from '../../components/ComponentsDashboard/Pabrik/DetailOrderMasuk/TabelDetailOrder.jsx';
import TabelRincianProduk from "../../components/ComponentsDashboard/Pabrik/DetailOrderMasuk/TableRincianProduk.jsx";

const DetailOrderMasuk = () => {
    const location = useLocation();
    const { order } = location.state || {};
    const [showDropdown, setShowDropdown] = useState(false);

    const { handleNavigation } = useNavigation(pabrikMenuItems);

    if (!order) {
        return <div className="p-8 text-red-500">Order tidak ditemukan.</div>;
    }

    return (
        <Layout
            menuItems={pabrikMenuItems}
            activeLabel="Daftar Order Masuk"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
        >
            <div className="flex items-center gap-4 mb-6">
                <img src={IconOrderMasuk} alt="Icon" className="w-8 h-8" />
                <h1 className="text-xl font-semibold text-blue-900">Daftar Order Masuk Dari Distributor</h1>
            </div>

            <div className="bg-white border-2 border-gray-200 shadow-lg rounded-xl p-6 space-y-6">
                <TabelDetailOrder order={order} />
                <TabelRincianProduk products={order.products} />
            </div>
        </Layout>
    );
};

export default DetailOrderMasuk;
