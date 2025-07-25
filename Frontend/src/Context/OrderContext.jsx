// src/Context/OrderContext.jsx
import React, { createContext, useState, useContext } from "react";

const OrderContext = createContext();

const sortOrders = (orders) => {
    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
    };

    return [...orders].sort((a, b) => {
        const dateA = parseDate(a.orderDate);
        const dateB = parseDate(b.orderDate);

        if (dateB.getTime() !== dateA.getTime()) {
            return dateB - dateA;
        }

        const idA = parseInt(a.orderId.split('-')[1]);
        const idB = parseInt(b.orderId.split('-')[1]);
        return idB - idA;
    });
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState(() =>
        sortOrders([
            {
                id: 1,
                orderId: 'ORD-005',
                distributor: 'PT. Maju Jaya',
                agentId: 'AGN-001',
                factoryId: 'FCT-001',
                orderDate: '18/06/2025',
                shippingDate: '-',
                deliveryEstimate: '-',
                noResi: '-',
                status: 'Tertunda',
                products: [
                    { name: 'Produk A', quantity: 2, unitPrice: 0, requestedPrice: 15000 },
                    { name: 'Produk B', quantity: 1, unitPrice: 0, requestedPrice: 25000 }
                ]
            },
            {
                id: 2,
                orderId: 'ORD-003',
                distributor: 'PT. Maju Jaya',
                agentId: 'AGN-001',
                factoryId: 'FCT-002',
                orderDate: '17/06/2025',
                shippingDate: '18/06/2025',
                deliveryEstimate: '-',
                noResi: '-',
                status: 'Disetujui',
                products: [
                    { name: 'Produk A', quantity: 2, unitPrice: 16000, requestedPrice: 15000 },
                    { name: 'Produk B', quantity: 1, unitPrice: 27000, requestedPrice: 25000 }
                ]
            },
            {
                id: 3,
                orderId: 'ORD-004',
                distributor: 'PT. Maju Jaya',
                agentId: 'AGN-003',
                factoryId: 'FCT-001',
                orderDate: '16/06/2025',
                shippingDate: '17/06/2025',
                deliveryEstimate: '-',
                noResi: '-',
                status: 'Diproses',
                products: [
                    { name: 'Produk C', quantity: 3, unitPrice: 12000, requestedPrice: 12000 }
                ]
            },
            {
                id: 4,
                orderId: 'ORD-002',
                distributor: '-',
                agentId: 'AGN-004',
                factoryId: 'FCT-002',
                orderDate: '15/06/2025',
                shippingDate: '-',
                deliveryEstimate: '-',
                noResi: '-',
                status: 'Ditolak',
                products: [
                    { name: 'Produk D', quantity: 2, unitPrice: 0, requestedPrice: 18000 }
                ]
            },
            {
                id: 5,
                orderId: 'ORD-001',
                distributor: 'PT. Maju Jaya',
                agentId: 'AGN-005',
                factoryId: 'FCT-003',
                orderDate: '15/06/2025',
                shippingDate: '16/06/2025',
                deliveryEstimate: '21/06/2025',
                noResi: 'SHP123456',
                status: 'Dikirim',
                products: [
                    { name: 'Produk A', quantity: 2, unitPrice: 16000, requestedPrice: 15000 }
                ]
            },
            {
                id: 6,
                orderId: 'ORD-006',
                distributor: 'PT. Maju Jaya',
                agentId: 'AGN-006',
                factoryId: 'FCT-001',
                orderDate: '18/06/2025',
                shippingDate: '-',
                deliveryEstimate: '-',
                noResi: '-',
                status: 'Diterima',
                products: [
                    { name: 'Produk Z', quantity: 1, unitPrice: 0, requestedPrice: 10000 }
                ]
            }
        ])
    );

    const [historyOrders, setHistoryOrders] = useState([]);
    const [ordersMasukPabrik, setOrdersMasukPabrik] = useState([]);
    const [validasiOrders, setValidasiOrders] = useState([]);
    const [monitoringOrders, setMonitoringOrders] = useState([]);

    const markAsCompleted = (orderId) => {
        setOrders(prev =>
            sortOrders(
                prev.map(order =>
                    order.orderId === orderId
                        ? { ...order, status: 'Selesai', receivedDate: new Date().toLocaleDateString('id-ID') }
                        : order
                )
            )
        );
    };

    const updateProductPrice = (orderId, productName, newUnitPrice) => {
        setOrders(prev =>
            sortOrders(
                prev.map(order => {
                    if (order.orderId !== orderId) return order;
                    return {
                        ...order,
                        products: order.products.map(p =>
                            p.name === productName ? { ...p, unitPrice: newUnitPrice } : p
                        )
                    };
                })
            )
        );
    };

    const deleteOrder = (orderId) => {
        setOrders(prev => sortOrders(prev.filter(order => order.orderId !== orderId)));
        setValidasiOrders(prev => prev.filter(order => order.orderId !== orderId));
    };

    const approveOrder = (orderId) => {
        setOrders(prev =>
            sortOrders(
                prev.map(order =>
                    order.orderId === orderId
                        ? { ...order, status: 'Disetujui' }
                        : order
                )
            )
        );
    };

    const updateOrderStatus = (orderId, newStatus) => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('id-ID');

        setOrders(prev => {
            let updatedOrderItem = null;

            const updated = sortOrders(
                prev.map(order => {
                    if (order.orderId !== orderId) return order;

                    const updatedOrder = {
                        ...order,
                        status: newStatus,
                        shippingDate: newStatus === 'Tertunda' ? formattedDate : order.shippingDate
                    };

                    updatedOrderItem = updatedOrder;
                    return updatedOrder;
                })
            );

            if (newStatus === 'Tertunda' && updatedOrderItem) {
                setOrdersMasukPabrik(prevMasuk => {
                    const alreadyExists = prevMasuk.some(
                        o => o.orderId === updatedOrderItem.orderId
                    );
                    if (!alreadyExists) {
                        return [...prevMasuk, structuredClone(updatedOrderItem)];
                    }
                    return prevMasuk;
                });
            }

            return updated;
        });
    };

    const addNewOrder = (newOrder) => {
        const adjustedOrder = {
            ...newOrder,
            address: newOrder.address || newOrder.alamat || '', // ⬅️ pastikan field 'address' tersedia
            products: newOrder.products.map((product) => ({
                ...product,
                quantity: product.jumlah ?? product.quantity,
                jumlah: undefined,
            })),
        };

        setOrders((prev) => sortOrders([...prev, adjustedOrder]));
        setValidasiOrders((prev) => [...prev, adjustedOrder]);
    };

    const [notifications, setNotifications] = useState([]);
    const addNotification = (message) => {
        const date = new Date();
        const formatted = date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        setNotifications(prev => [
            {
                id: Date.now(),
                message,
                date: formatted
            },
            ...prev
        ]);
    };

    const sendToMonitoringOrder = (orderId) => {
        setOrders(prevOrders => {
            const updatedOrders = prevOrders.map(order => {
                if (order.orderId === orderId) {
                    return {
                        ...order,
                        status: 'Diproses',
                        shippingDate: new Date().toLocaleDateString('id-ID'),
                    };
                }
                return order;
            });

            const updatedOrder = updatedOrders.find(order => order.orderId === orderId);

            if (updatedOrder) {
                setMonitoringOrders(prev => {
                    const alreadyExists = prev.some(o => o.orderId === orderId);
                    if (!alreadyExists) {
                        return [...prev, structuredClone(updatedOrder)];
                    }
                    return prev;
                });
            }

            return sortOrders(updatedOrders);
        });

        addNotification(`Order ${orderId} berhasil dikirim ke monitoring.`);
    };

    const moveToHistory = (orderId) => {
        setOrders(prevOrders =>
            prevOrders.map(order => {
                if (order.orderId === orderId && order.status === 'Dikirim') {
                    const products = order.products || [];
                    const total = products.reduce((sum, item) => {
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
                }
                return order;
            })
        );
    };

    // Fungsi ubah status dari Tertunda menjadi Disetujui di kirim order ke ringkasan order
    const setOrderToApproved = (orderId) => {
        setOrders(prev =>
            sortOrders(
                prev.map(order =>
                    order.orderId === orderId && order.status === 'Tertunda'
                        ? { ...order, status: 'Disetujui' }
                        : order
                )
            )
        );
    };

    const markAsProcessed = (orderId) => {
        setOrders(prev =>
            sortOrders(
                prev.map(order =>
                    order.orderId === orderId && order.status === 'Disetujui'
                        ? { ...order, status: 'Diproses' }
                        : order
                )
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
                setOrderToApproved,
                updateOrderStatus,
                addNewOrder,
                notifications,
                setNotifications,
                addNotification,
                historyOrders,
                moveToHistory,
                markAsProcessed
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
