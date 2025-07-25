import { useEffect, useState } from "react";
import { useOrder } from "../../../Context/OrderContext";
import { useNavigation } from "../../useNavigation";
import { agenMenuItems } from "../../../components/ComponentsDashboard/Constants/menuItems";
import useOrderFormState from "./useOrderFormState";
import { formatDate } from "../../../components/ComponentsDashboard/Common/date";
import bagIcon from "../../../assets/IconHeader/IconBag.png";

export const usePermintaanOrderPage = () => {
    const { orders, setOrders } = useOrder();
    const agentId = 5; // user login
    const agentName = "Agen 2"; // bisa diambil dari login context/session nanti

    const [distributorInfo, setDistributorInfo] = useState(null);
    const { handleNavigation } = useNavigation(agenMenuItems);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown((prev) => !prev);

    useEffect(() => {
        fetch(`http://localhost:8080/api/agen-distributor/${agentId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.distributor_id && data.name) {
                    setDistributorInfo({
                        id: data.distributor_id,
                        name: data.name,
                        email: data.email
                    });
                } else {
                    alert('Distributor tidak ditemukan untuk agen ini.');
                }
            })
            .catch(err => console.error("Error fetch distributor:", err));
    }, []);

    const {
        produk,
        jumlah,
        harga,
        alamat,
        produkList,
        setProduk,
        setJumlah,
        setHarga,
        setAlamat,
        handleAddProduk,
        handleDeleteProduk,
        handleSubmit
    } = useOrderFormState({
        agentId,
        distributorInfo: distributorInfo || { id: null, name: "" },
        orders,
        setOrders,
        onSuccess: () => handleNavigation("/ringkasan-order")
    });

    const layoutProps = {
        menuItems: agenMenuItems,
        activeLabel: "Permintaan Order",
        onNavigate: handleNavigation,
        showDropdown,
        toggleDropdown
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
        agentName,
        distributorName: distributorInfo?.name || '',
        orderDate: formatDate(new Date())
    };

    return {
        layoutProps,
        pageTitleProps,
        orderFormProps,
        handleSubmit
    };
};
