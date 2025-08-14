import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { updateOrderStatus } from '../services/ordersApi';
import { useAuth } from './AuthContext';

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
        'Diproses': 'processing',
        'Selesai Produksi': 'produced',
        'Dikirim': 'shipped',
        'Selesai': 'delivered',
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
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        setLoading(true);

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

            const data = await response.json(); // ✅ ini harus di atas
            const ordersRaw = data.data || data;
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = Number(user?.id);

            const normalized = ordersRaw.map(order => ({
                ...order,
                id: order.id,
                pabrikId: order.pabrik_id, // ⬅️ Tambahan penting!
                status: normalizeStatus(order.status),
                distributorId: order.distributor_id,
                agentId: order.agen_id,
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
            }))
            // ✨ Filter hanya milik distributor yang login
            // .filter(order => String(order.distributorId) === String(userId));
            const filtered = normalized.filter(order => {
                const role = (user.role || '').toLowerCase();
                const idStr = String(userId);

                if (role === 'agen') return String(order.agentId) === idStr;
                if (role === 'distributor') return String(order.distributorId) === idStr;
                if (role === 'pabrik') return String(order.pabrikId) === idStr;

                return true; // admin/unknown role, lihat semua
            });

            const sorted = sortOrders(filtered);
            setOrders(sorted);

            // ✅ Pisahkan berdasarkan status
            setValidasiOrders(sorted.filter(order =>
                ['pending'].includes(order.status)
            ));

            setMonitoringOrders(sorted.filter(order =>
                ['approved', 'processing', 'produced', 'shipped'].includes(order.status)
            ));

            setOrdersMasukPabrik(sorted.filter(order =>
                ['approved'].includes(order.status)
                 //order.status === 'approved' && (order.pabrikId === null || order.pabrikId === undefined)
            ));

        } catch (error) {
            console.error("Fetch orders error:", error);
        }
    }, []);

    const { user } = useAuth();

    useEffect(() => {
        if (user && user.id) {
            fetchOrders();
        }
    }, [user, fetchOrders]);


    const updateOrder = (orderId, updater) => {
        setOrders(prev => sortOrders(
            prev.map(order => (order.orderId === orderId ? updater(order) : order))
        ));
    };

    const markAsCompleted = (orderId) => {
        updateOrder(orderId, order => ({
            ...order,
            status: 'delivered',
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

    const updateOrderStatusInState = (orderId, newStatus) => {
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
                status: 'processing',
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
                status: 'delivered',
                receivedDate: new Date().toLocaleDateString('id-ID'),
                total,
            };
        });
    };

    const markAsProcessed = (orderId) => {
        updateOrder(orderId, order =>
            order.status === 'approved' ? { ...order, status: 'processing' } : order
        );
    };

    const setOrderToApproved = async (orderId) => {
        try {
            const order = orders.find(o => o.orderId === orderId || o.id === orderId);
            if (!order) throw new Error("Order tidak ditemukan");

            const id = order.id;

            await updateOrderStatus(id, 'delivered');

            updateOrder(orderId, (order) => ({
                ...order,
                status: 'delivered',
                receivedDate: new Date().toLocaleDateString('id-ID'),
            }));

            await fetchOrders();
        } catch (error) {
            console.error("Gagal mengubah status order:", error);
            throw error;
        }
    };



    // const updateOrderStatusInContext = (orderId, newStatus) => {
    //     updateOrder(orderId, (order) => ({
    //         ...order,
    //         status: newStatus,
    //     }));
    // };

    // Rabu 

    const updateOrderStatusInContext = (orderId, newStatus, extraFields = {}) => {
    setOrders((prevOrders) =>
        prevOrders.map((o) =>
        o.orderId === orderId
            ? { ...o, status: newStatus, ...extraFields }
            : o
        )
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
                updateOrderStatusInState,
                addNewOrder,
                notifications,
                setNotifications,
                addNotification,
                historyOrders,
                moveToHistory,
                markAsProcessed,
                updateOrderStatusInContext,
                setOrderToApproved,
                fetchOrders,
                loading,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder harus digunakan di dalam OrderProvider');
    }
    return context;
};

