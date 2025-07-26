// src/Context/OrderContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

const OrderContext = createContext();
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const parseDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string' || !dateStr.includes('/')) {
        console.warn('Invalid orderDate:', dateStr);
        return new Date(0); // fallback aman
    }

    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
};

const sortOrders = (orders) => {
    return [...orders]
        .filter(order => order?.orderDate && typeof order.orderDate === 'string' && order.orderDate.includes('/')) // hanya order valid
        .sort((a, b) => {
            const dateA = parseDate(a.orderDate);
            const dateB = parseDate(b.orderDate);

            if (dateB - dateA !== 0) return dateB - dateA;

            const idA = parseInt((a.orderId || '').split('-')[1]) || 0;
            const idB = parseInt((b.orderId || '').split('-')[1]) || 0;

            return idB - idA;
        });
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [historyOrders, setHistoryOrders] = useState([]);
    const [ordersMasukPabrik, setOrdersMasukPabrik] = useState([]);
    const [validasiOrders, setValidasiOrders] = useState([]);
    const [monitoringOrders, setMonitoringOrders] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const fetchOrders = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/orders`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Gagal fetch orders");
            const data = await response.json();

            const sorted = sortOrders(data);
            setOrders(sorted);
            setValidasiOrders(sorted.filter(order => order.status === 'Menunggu Validasi'));
            setMonitoringOrders(sorted.filter(order => order.status === 'Diproses'));
            setOrdersMasukPabrik(sorted.filter(order => order.status === 'Tertunda'));
        } catch (error) {
            console.error("Fetch orders error:", error);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateOrder = (orderId, updater) => {
        setOrders(prev => sortOrders(
            prev.map(order => (order.orderId === orderId ? updater(order) : order))
        ));
    };

    const markAsCompleted = (orderId) => {
        updateOrder(orderId, order => ({
            ...order,
            status: 'Selesai',
            receivedDate: new Date().toLocaleDateString('id-ID')
        }));
    };

    const updateProductPrice = (orderId, productName, newUnitPrice) => {
        updateOrder(orderId, order => ({
            ...order,
            products: order.products.map(p =>
                p.name === productName ? { ...p, unitPrice: newUnitPrice } : p
            )
        }));
    };

    const deleteOrder = (orderId) => {
        setOrders(prev => sortOrders(prev.filter(order => order.orderId !== orderId)));
        setValidasiOrders(prev => prev.filter(order => order.orderId !== orderId));
    };

    const approveOrder = (orderId) => {
        updateOrder(orderId, order => ({ ...order, status: 'Disetujui' }));
    };

    const updateOrderStatus = (orderId, newStatus) => {
        const today = new Date().toLocaleDateString('id-ID');

        updateOrder(orderId, order => {
            const updatedOrder = {
                ...order,
                status: newStatus,
                shippingDate: newStatus === 'Tertunda' ? today : order.shippingDate,
            };

            if (newStatus === 'Tertunda') {
                setOrdersMasukPabrik(prev => {
                    const exists = prev.some(o => o.orderId === orderId);
                    return exists ? prev : [...prev, structuredClone(updatedOrder)];
                });
            }

            return updatedOrder;
        });
    };

    const addNewOrder = (newOrder) => {
        const today = new Date().toLocaleDateString('id-ID');

        const adjustedOrder = {
            ...newOrder,
            orderDate: newOrder.orderDate || today,
            address: newOrder.address || newOrder.alamat || '',
            products: newOrder.products.map(p => ({
                ...p,
                quantity: p.jumlah ?? p.quantity,
                jumlah: undefined
            })),
        };

        const sorted = sortOrders([...orders, adjustedOrder]);
        setOrders(sorted);
        setValidasiOrders(prev => [...prev, adjustedOrder]);
    };

    const addNotification = (message) => {
        const formatted = new Date().toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        setNotifications(prev => [{ id: Date.now(), message, date: formatted }, ...prev]);
    };

    const sendToMonitoringOrder = (orderId) => {
        updateOrder(orderId, order => {
            const updatedOrder = {
                ...order,
                status: 'Diproses',
                shippingDate: new Date().toLocaleDateString('id-ID'),
            };
            setMonitoringOrders(prev => {
                const exists = prev.some(o => o.orderId === orderId);
                return exists ? prev : [...prev, structuredClone(updatedOrder)];
            });
            addNotification(`Order ${orderId} berhasil dikirim ke monitoring.`);
            return updatedOrder;
        });
    };

    const moveToHistory = (orderId) => {
        updateOrder(orderId, order => {
            if (order.status !== 'Dikirim') return order;
            const total = (order.products || []).reduce((sum, item) => {
                const price = item.unitPrice || 0;
                const qty = item.quantity || 0;
                return sum + price * qty;
            }, 0);

            return {
                ...order,
                status: 'Selesai',
                receivedDate: new Date().toLocaleDateString('id-ID'),
                total,
            };
        });
    };

    const setOrderToApproved = (orderId) => {
        updateOrder(orderId, order =>
            order.status === 'Tertunda' ? { ...order, status: 'Disetujui' } : order
        );
    };

    const markAsProcessed = (orderId) => {
        updateOrder(orderId, order =>
            order.status === 'Disetujui' ? { ...order, status: 'Diproses' } : order
        );
    };

    return (
        <OrderContext.Provider
            value={{
                orders,
                setOrders,
                ordersMasukPabrik,
                setOrdersMasukPabrik,
                validasiOrders,
                setValidasiOrders,
                monitoringOrders,
                sendToMonitoringOrder,
                markAsCompleted,
                updateProductPrice,
                deleteOrder,
                approveOrder,
                setOrderToApproved,
                updateOrderStatus,
                addNewOrder,
                notifications,
                setNotifications,
                addNotification,
                historyOrders,
                moveToHistory,
                markAsProcessed,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
