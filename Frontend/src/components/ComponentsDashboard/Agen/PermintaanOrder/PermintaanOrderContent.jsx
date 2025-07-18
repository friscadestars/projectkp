// PermintaanOrderContent.jsx
import React from "react";
import PageTitle from "../../Common/PageHeader";
import OrderForm from "./OrderForm";
import SubmitButton from "../../Common/SubmitButton";

const PermintaanOrderContent = ({
  title, icon,
  produk, jumlah, harga, produkList, alamat,
  setProduk, setJumlah, setHarga, setAlamat,
  handleAddProduk, handleDeleteProduk,
  handleSubmit,
  orderId, agentId, distributorName, orderDate
}) => {
  return (
    <>
      <PageTitle icon={icon} title={title} />
      <OrderForm
        produk={produk}
        jumlah={jumlah}
        harga={harga}
        produkList={produkList}
        alamat={alamat}
        setProduk={setProduk}
        setJumlah={setJumlah}
        setHarga={setHarga}
        setAlamat={setAlamat}
        handleAddProduk={handleAddProduk}
        handleDeleteProduk={handleDeleteProduk}
        orderId={orderId}
        agentId={agentId}
        distributorName={distributorName}
        orderDate={orderDate}
      >
        <SubmitButton onClick={handleSubmit} />
      </OrderForm>
    </>
  );
};

export default PermintaanOrderContent;
