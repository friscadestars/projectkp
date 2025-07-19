import { useOrder } from "../../../Context/OrderContext";
import { useNavigation } from "../../useNavigation";
import { agenMenuItems } from "../../../Components/ComponentsDashboard/Constants/menuItems";
import useOrderFormState from "./useOrderFormState";
import { formatDate } from "../../../components/ComponentsDashboard/Common/date";
import bagIcon from "../../../assets/IconHeader/IconBag.png";
import { useState } from "react"; // ✅ Tambahkan ini

export const usePermintaanOrderPage = () => {
    const { orders, setOrders } = useOrder();
    const agentId = "AG001";
    const distributorInfo = { id: "DS-002", name: "PT. Maju Jaya" };

    const { handleNavigation } = useNavigation(agenMenuItems);

    // ✅ Tambahkan state showDropdown
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(prev => !prev);

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

    // ✅ Masukkan showDropdown dan toggleDropdown ke layoutProps
    const layoutProps = {
        menuItems: agenMenuItems,
        activeLabel: "Permintaan Order",
        onNavigate: handleNavigation,
        showDropdown,
        toggleDropdown,
    };

    const pageTitleProps = {
        icon: bagIcon,
        title: "Form Permintaan Order"
    };

    const orderFormProps = {
        produk,
        jumlah,
        harga,
        produkList,
        alamat,
        setProduk,
        setJumlah,
        setHarga,
        setAlamat,
        handleAddProduk,
        handleDeleteProduk,
        orderId: `ORD-00${orders.length + 1}`,
        agentId,
        distributorName: distributorInfo.name,
        orderDate: formatDate(new Date())
    };

    return {
        layoutProps,
        pageTitleProps,
        orderFormProps,
        handleSubmit
    };
};
