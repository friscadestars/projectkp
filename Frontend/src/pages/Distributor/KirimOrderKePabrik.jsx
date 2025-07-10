import React, { useState } from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout.jsx';
import PageHeader from '../../Components/ComponentsDashboard/Common/PageHeader';
import OrderTable from '../../Components/ComponentsDashboard/Agen/Table/OrderTable';
import SearchInput from '../../Components/ComponentsDashboard/Common/SearchInput';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useOrder } from '../../Context/OrderContext.jsx';
import { useNavigation } from '../../hooks/useNavigation';
import kirimOrder from '../../assets/IconHeader/KirimOrderIcon.png';

const KirimOrderKePabrik = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { handleNavigation } = useNavigation(distributorMenuItems);
    const { orders } = useOrder();

    const approvedOrders = orders
        .filter(order => order.status === 'Disetujui')
        .filter(order =>
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.agentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.distributor?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <AgenLayout
            menuItems={distributorMenuItems}
            activeLabel="Kirim Order ke Pabrik"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
        >
            <PageHeader icon={kirimOrder} title="Kirim Orderan ke Pabrik" />

            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari Order ID / Agen / Distributor"
                    className="mb-4"
                />

                <OrderTable
                    orders={approvedOrders}
                    statusColor="green"
                    detailPath="/distributor/detail-kirim"
                    emptyMessage="Tidak ada order yang disetujui."
                />
            </div>
        </AgenLayout>
    );
};

export default KirimOrderKePabrik;
