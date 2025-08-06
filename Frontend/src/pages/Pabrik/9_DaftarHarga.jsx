// import React from "react";
// import Layout from "../../Components/ComponentsDashboard/Layout/Layout";
// import PageHeader from "../../components/ComponentsDashboard/Common/PageHeader";
// import { pabrikMenuItems } from "../../components/ComponentsDashboard/Constants/menuItems";
// import iconDaftarHarga from "../../assets/IconHeader/HargaIcon.png";
// import { HargaProdukProvider } from "../../Context/HargaProdukContext";
// import { useDaftarHarga } from "../../hooks/Pabrik/useDaftarHarga";
// import FormTambahProduk from "../../components/ComponentsDashboard/Pabrik/6_DaftarHarga/FormTambahProduk";
// import TabelDaftarHarga from "../../components/ComponentsDashboard/Pabrik/6_DaftarHarga/TabelDaftarHarga";
// import { useNavigation } from '../../hooks/useNavigation';
// import SearchInput from '../../Components/ComponentsDashboard/Common/SearchInput.jsx';

// const DaftarHarga = () => {
//   return (
//     <HargaProdukProvider>
//       <DaftarHargaContent />
//     </HargaProdukProvider>
//   );
// };

// const DaftarHargaContent = () => {
//   const {
//     searchTerm,
//     setSearchTerm,
//     filteredProducts,
//     addProduct,
//     updateProduct,
//     deleteProduct,
//     editingId,
//     setEditingId
//   } = useDaftarHarga();

//   const { handleNavigation } = useNavigation(pabrikMenuItems);

//   return (
//     <Layout
//       menuItems={pabrikMenuItems}
//       activeLabel="Daftar Harga"
//       onNavigate={handleNavigation}
//     >
//       <PageHeader icon={iconDaftarHarga} title="Daftar Harga Produk" />
//       <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
//         <FormTambahProduk addProduct={addProduct} />

//         {/* Search Input */}
//         <SearchInput
//           placeholder="Cari Produk"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <TabelDaftarHarga
//           products={filteredProducts}
//           updateProduct={updateProduct}
//           deleteProduct={deleteProduct}
//           editingId={editingId}
//           setEditingId={setEditingId}
//         />
//       </div>
//     </Layout>
//   );
// };

// export default DaftarHarga;

import React from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { usePabrikPriceListPage } from '../../hooks/Pabrik/PriceList/usePabrikPriceListPage';
import PriceListSection from '../../components/ComponentsDashboard/Pabrik/6_DaftarHarga/PriceListSection';
import PageHeader from '../../components/ComponentsDashboard/Common/PageHeader'; 
import { pabrikMenuItems } from "../../components/ComponentsDashboard/Constants/menuItems";
import { useNavigation } from '../../hooks/useNavigation';
import iconDaftarHarga from "../../assets/IconHeader/HargaIcon.png";

const DaftarHarga = () => {
    // const [showDropdown, setShowDropdown] = useState(false);
    // const toggleDropdown = () => setShowDropdown(prev => !prev);
    const {  pageTitleProps, ...restProps } = usePabrikPriceListPage();
    const { handleNavigation } = useNavigation(pabrikMenuItems);

    return (
        // <Layout
        //     {...layoutProps}
        //     showDropdown={showDropdown}
        //     toggleDropdown={toggleDropdown}
        //     role="pabrik"
        // >

        <Layout
          menuItems={pabrikMenuItems}
          activeLabel="Daftar Harga"
          onNavigate={handleNavigation}
        >
            <PageHeader {...pageTitleProps}   
            icon={iconDaftarHarga}
            title="Daftar Harga Produk"/>
            <PriceListSection {...restProps}
                canEdit={true} />
        </Layout>
    );
};

export default DaftarHarga;


