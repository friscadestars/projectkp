import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

const OrderContext = createContext();
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/* Ubah format backend jadi DD/MM/YYYY */
const toUiDate = (str) => {
    if (!str) return '';
    const d = new Date(str.replace(' ', 'T'));
    return isNaN(d) ? '' : d.toLocaleDateString('id-ID');
};

/* Normalisasi status dari backend */
const normalizeStatus = (status) => {
    const map = {
        'Menunggu Validasi': 'pending',
        'Tertunda': 'approved',
        'Disetujui': 'approved',
        'Diproses': 'processed',
        'Dikirim': 'shipped',
        'Selesai': 'received',
        'Ditolak': 'cancelled',
    };
    return map[status] || status?.toLowerCase();
};

/* Sorting orders terbaru */
const sortOrders = (orders) => {
    return [...orders].sort((a, b) => {
        const dateA = a.orderDate ? new Date(a.orderDate.split('/').reverse().join('-')) : new Date(0);
        const dateB = b.orderDate ? new Date(b.orderDate.split('/').reverse().join('-')) : new Date(0);
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
        console.log("📥 fetchOrders() dipanggil");

        let response;
        try {
            const token = localStorage.getItem('token');
            response = await fetch(`${API_BASE}/orders`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            console.log("📡 Status response:", response.status);

            if (!response.ok) throw new Error("Gagal fetch orders");

            const data = await response.json();
            const ordersRaw = data.data || data;

            const normalized = ordersRaw.map(order => ({
                ...order,
                status: normalizeStatus(order.status),
                orderDate: toUiDate(order.order_date || order.orderDate),
                deliveryEstimate: toUiDate(order.delivery_date),
                noResi: order.resi || '-',
                agenName: order.agen || order.agen_name || '-',
                orderId: order.orderId || order.order_code || `ORD-${order.id}`,
                products: (order.items || []).map(p => ({
                    ...p,
                    product_name: p.product_name || p.name || "Produk",
                    unit_price: p.unit_price ?? p.unitPrice ?? 0,
                    quantity: p.quantity ?? p.jumlah ?? 0,
                })),
            }));

            const sorted = sortOrders(normalized);
            setOrders(sorted);
            setValidasiOrders(sorted.filter(order => order.status === 'pending'));
            setMonitoringOrders(
                sorted.filter(order =>
                    ['approved', 'processed', 'shipped', 'received'].includes(order.status)
                )
            );
            setOrdersMasukPabrik(sorted.filter(order => order.status === 'approved'));

        } catch (error) {
            console.error("Fetch orders error:", error);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchOrders();
        }
    }, [fetchOrders]);


    const updateOrder = (orderId, updater) => {
        setOrders(prev => sortOrders(
            prev.map(order => (order.orderId === orderId ? updater(order) : order))
        ));
    };

    const markAsCompleted = (orderId) => {
        updateOrder(orderId, order => ({
            ...order,
            status: 'received',
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
        updateOrder(orderId, order => ({ ...order, status: 'approved' }));
    };

    const updateOrderStatus = (orderId, newStatus) => {
        const today = new Date().toLocaleDateString('id-ID');
        updateOrder(orderId, order => {
            const updated = {
                ...order,
                status: newStatus,
                shippingDate: newStatus === 'pending' ? today : order.shippingDate,
            };

            if (newStatus === 'pending') {
                setOrdersMasukPabrik(prev => {
                    const exists = prev.some(o => o.orderId === orderId);
                    return exists ? prev : [...prev, structuredClone(updated)];
                });
            }

            return updated;
        });
    };

    const addNewOrder = (newOrder) => {
        const today = new Date().toLocaleDateString('id-ID');
        const adjustedOrder = {
            ...newOrder,
            orderDate: newOrder.orderDate || today,
            status: normalizeStatus(newOrder.status || 'pending'),
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
            const updated = {
                ...order,
                status: 'processed',
                shippingDate: new Date().toLocaleDateString('id-ID'),
            };
            setMonitoringOrders(prev => {
                const exists = prev.some(o => o.orderId === orderId);
                return exists ? prev : [...prev, structuredClone(updated)];
            });
            addNotification(`Order ${orderId} berhasil dikirim ke monitoring.`);
            return updated;
        });
    };

    const moveToHistory = (orderId) => {
        updateOrder(orderId, order => {
            if (order.status !== 'shipped') return order;
            const total = (order.products || []).reduce((sum, item) => {
                const price = item.unitPrice || 0;
                const qty = item.quantity || 0;
                return sum + price * qty;
            }, 0);
            return {
                ...order,
                status: 'received',
                receivedDate: new Date().toLocaleDateString('id-ID'),
                total,
            };
        });
    };

    const markAsProcessed = (orderId) => {
        updateOrder(orderId, order =>
            order.status === 'approved' ? { ...order, status: 'processed' } : order
        );
    };

    const updateOrderStatusInContext = (orderId, newStatus) => {
        updateOrder(orderId, (order) => ({
            ...order,
            status: newStatus
        }));
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
                updateOrderStatus,
                addNewOrder,
                notifications,
                setNotifications,
                addNotification,
                historyOrders,
                moveToHistory,
                markAsProcessed,
                updateOrderStatusInContext,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
