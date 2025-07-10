import React from "react";
import { useOrder } from "../../Context/OrderContext.jsx";
import Layout from "../../Components/ComponentsDashboard/Layout/Layout";
import OrderForm from "../../Components/ComponentsDashboard/Common/OrderForm.jsx";
import SubmitButton from "../../Components/ComponentsDashboard/Button/SubmitButton.jsx";
import PageTitle from "../../Components/ComponentsDashboard/Common/PageHeader";
import { agenMenuItems } from "../../Components/ComponentsDashboard/Constants/menuItems.js";
import useOrderFormState from "../../hooks/Agen/useOrderFormState.js";
import { formatDate } from "../../Components/ComponentsDashboard/Common/date.jsx";
import bagIcon from '../../assets/IconHeader/IconBag.png';
import { useNavigation } from "../../hooks/useNavigation";

const PermintaanOrder = () => {
    const { orders, setOrders } = useOrder();

    const agentId = "AG001";
    const distributorInfo = { id: "DS-002", name: "PT. Maju Jaya" };

    const {
        produk, jumlah, harga, alamat, produkList,
        setProduk, setJumlah, setHarga, setAlamat,
        handleAddProduk, handleDeleteProduk,
        handleSubmit
    } = useOrderFormState({
        agentId,
        distributorInfo,
        orders,
        setOrders,
        onSuccess: () => handleNavigation('/ringkasan-order')
    });

    const { handleNavigation } = useNavigation(agenMenuItems);

    return (
        <Layout
            menuItems={agenMenuItems}
            activeLabel="Permintaan Order"
            onNavigate={handleNavigation}
        >
            <PageTitle icon={bagIcon} title="Form Permintaan Order" />

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
                orderId={`ORD-00${orders.length + 1}`}
                agentId={agentId}
                distributorName={distributorInfo.name}
                orderDate={formatDate(new Date())}
            >
                <SubmitButton onClick={handleSubmit} />
            </OrderForm>
        </Layout>
    );
};

export default PermintaanOrder;
