// src/hooks/distributor/useRiwayatOrderData.js
import { useEffect, useState } from "react";
import axios from "axios";

const useRiwayatOrderData = (orderId) => {
    const [orderInfo, setOrderInfo] = useState(null);
    const [produkList, setProdukList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const res = await axios.get(`/api/orders/${orderId}`);
                const { order, products } = res.data;

                setOrderInfo(order);
                setProdukList(products);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId]);

    return { orderInfo, produkList, loading, error };
};

export default useRiwayatOrderData;
