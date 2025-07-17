import React from "react";
import Layout from "../../Components/ComponentsDashboard/Layout/Layout";
import PageHeader from "../../Components/ComponentsDashboard/Common/PageHeader";
import { pabrikMenuItems } from "../../Components/ComponentsDashboard/Constants/menuItems";
import iconDaftarHarga from "../../assets/IconHeader/HargaIcon.png";
import { HargaProdukProvider } from "../../Context/HargaProdukContext";
import { useDaftarHarga } from "../../hooks/Pabrik/useDaftarHarga";
import FormTambahProduk from "../../components/ComponentsDashboard/Pabrik/6_DaftarHarga/FormTambahProduk";
import TabelDaftarHarga from "../../components/ComponentsDashboard/Pabrik/6_DaftarHarga/TabelDaftarHarga";
import { useNavigation } from '../../hooks/useNavigation';
import SearchInput from '../../Components/ComponentsDashboard/Common/SearchInput.jsx';

const DaftarHarga = () => {
  return (
    <HargaProdukProvider>
      <DaftarHargaContent />
    </HargaProdukProvider>
  );
};

const DaftarHargaContent = () => {
  const {
    searchTerm,
    setSearchTerm,
    filteredProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    editingId,
    setEditingId
  } = useDaftarHarga();

  const { handleNavigation } = useNavigation(pabrikMenuItems);

  return (
    <Layout
      menuItems={pabrikMenuItems}
      activeLabel="Daftar Harga"
      onNavigate={handleNavigation}
    >
      <PageHeader icon={iconDaftarHarga} title="Daftar Harga Produk" />
      <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
        <FormTambahProduk addProduct={addProduct} />

        {/* Search Input */}
        <SearchInput
          placeholder="Cari Produk"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <TabelDaftarHarga
          products={filteredProducts}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      </div>
    </Layout>
  );
};

export default DaftarHarga;
