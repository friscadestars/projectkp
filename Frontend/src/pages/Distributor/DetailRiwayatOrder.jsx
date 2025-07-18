import React from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import FormTitle from '../../components/ComponentsDashboard/Common/PageHeader';
import { distributorMenuItems } from '../../components/ComponentsDashboard/Constants/menuItems';
import iconRiwayat from '../../assets/IconHeader/IconRiwayat.png';
import DetailRiwayatOrderLayout from '../../components/ComponentsDashboard/Distributor/RiwayatOrder/DetailRiwayatOrderLayout';
import { useNavigation } from '../../hooks/useNavigation';

const DetailRiwayatOrder = () => {
    const { handleNavigation } = useNavigation(distributorMenuItems);

    const orderInfo = {
        id: 'ORD-001',
        agenId: 'AG-001',
        tanggalOrder: '24/06/2025',
        tanggalPengiriman: '26/06/2025',
        statusPembayaran: 'Belum Dibayar',
        statusOrder: 'Diterima',
        products: [
            { nama: 'Beras Premium 10kg', jumlah: 2, hargaAgen: 'Rp 100.000', hargaPabrik: 'Rp 80.000' },
            { nama: 'Beras Premium 5kg', jumlah: 1, hargaAgen: 'Rp 25.000', hargaPabrik: 'Rp 20.000' },
            { nama: 'Beras Premium 1kg', jumlah: 1, hargaAgen: 'Rp 25.000', hargaPabrik: 'Rp 20.000' },
        ]
    };

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Riwayat Order"
            onNavigate={handleNavigation}
            role="distributor" 
        >
            <FormTitle icon={iconRiwayat} title="Riwayat Order" />
            <DetailRiwayatOrderLayout
                order={orderInfo}
                titleText="Riwayat Order"
                icon={iconRiwayat}
            />
        </Layout>
    );
};

export default DetailRiwayatOrder;
