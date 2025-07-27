// FILE: usePermintaanOrderPage.js
import { useEffect, useState } from "react";
import { useOrder } from "../../../Context/OrderContext";
import { useNavigation } from "../../useNavigation";
import { agenMenuItems } from "../../../components/ComponentsDashboard/Constants/menuItems";
import useOrderFormState from "./useOrderFormState";
import { formatDate } from "../../../components/ComponentsDashboard/Common/date";
import bagIcon from "../../../assets/IconHeader/IconBag.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const usePermintaanOrderPage = () => {
    const { orders, setOrders } = useOrder();

    const users = JSON.parse(localStorage.getItem('user')) || {};
    const agentId = users.id;
    const agentName = users.name;

    const [distributorInfo, setDistributorInfo] = useState(null);
    const [lastOrderId, setLastOrderId] = useState(0);
    const [isDataReady, setIsDataReady] = useState(false);
    const { handleNavigation } = useNavigation(agenMenuItems);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown((prev) => !prev);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!agentId) return;

                const token = localStorage.getItem('token');

                const [distributorRes, orderRes] = await Promise.all([
                    fetch(`${API_BASE}/agen-distributor/${agentId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE}/orders/last?agen_id=${agentId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const distributorData = await distributorRes.json();
                const orderData = await orderRes.json();

                if (distributorData?.distributor_id) {
                    setDistributorInfo({
                        id: distributorData.distributor_id,
                        name: distributorData.name,
                        email: distributorData.email
                    });
                }

                if (orderData?.order_id) {
                    setLastOrderId(orderData.order_id);
                }

                setIsDataReady(true);
            } catch (err) {
                console.error("Gagal memuat data:", err);
            }
        };

        fetchData();
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
        setLastOrderId,
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
        produkList: Array.isArray(produkList) ? produkList : [],
        alamat,
        setProduk,
        setJumlah,
        setHarga,
        setAlamat,
        handleAddProduk,
        handleDeleteProduk,
        orderId: lastOrderId || '',
        agentName,
        distributorName: distributorInfo?.name || '',
        orderDate: formatDate(new Date())
    };

    return {
        layoutProps,
        pageTitleProps,
        orderFormProps,
        handleSubmit,
        loading: !isDataReady
    };
};
