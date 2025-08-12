import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { pabrikMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import PageHeader from '../../components/ComponentsDashboard/Common/PageHeader';
import TableProduksiPengiriman from '../../components/ComponentsDashboard/Pabrik/3_ProduksiPengiriman/TabelProduksiPengiriman';
import iconProduksi from '../../assets/IconHeader/IconProduksi.png';
import { OrderPabrikProvider } from '../../Context/OrderContextPabrik'; 

const ProduksiPengiriman = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { handleNavigation } = useNavigation(pabrikMenuItems);

  return (
    <OrderPabrikProvider> 
      <Layout
        menuItems={pabrikMenuItems}
        activeLabel="Produksi & Pengiriman"
        onNavigate={handleNavigation}
        showDropdown={showDropdown}
        toggleDropdown={() => setShowDropdown(prev => !prev)}
      >
        <PageHeader icon={iconProduksi} title="Produksi & Pengiriman ke Agen" />
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
          <TableProduksiPengiriman />
        </div>
      </Layout>
    </OrderPabrikProvider>
  );
};

export default ProduksiPengiriman;
