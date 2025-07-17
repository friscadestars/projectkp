import React, { createContext, useState, useContext } from "react";

const OrderPabrikContext = createContext();

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

export const OrderPabrikProvider = ({ children }) => {
  const [orders, setOrders] = useState(() =>
    sortOrders([
      {
        id: 1,
        orderId: 'ORD-001',
        distributor: 'PT. Maju Jaya',
        agentId: 'AG-001',
        agentAddress: 'Jl. Sidomakmur no.20 Surabaya',
        orderDate: '24/06/2025',
        status: 'Sedang Diproduksi',
        noResi: '-',
        shippingDate: '-',
        products: [
          { name: 'Beras Premium 5kg', quantity: 2 },
          { name: 'Minyak Goreng 1L', quantity: 1 },
        ]
      },
      {
        id: 2,
        orderId: 'ORD-002',
        distributor: 'PT. Maju Jaya',
        agentId: 'AG-001',
        agentAddress: 'Jl. Melati no.20 Jakarta',
        orderDate: '24/06/2025',
        status: 'Sedang Diproduksi',
        noResi: '-',
        shippingDate: '-',
        products: [
          { name: 'Gula Pasir 1kg', quantity: 3 }
        ]
      },
      {
        id: 3,
        orderId: 'ORD-003',
        distributor: 'PT. Maju Jaya',
        agentId: 'AG-001',
        agentAddress: 'Jl. Melati no.20 Jakarta',
        orderDate: '25/06/2025',
        status: 'Selesai Produksi',
        noResi: '-',
        shippingDate: '-',
        products: [
          { name: 'Susu UHT 1L', quantity: 5 }
        ]
      },
      {
        id: 4,
        orderId: 'ORD-004',
        distributor: 'PT. Maju Jaya',
        agentId: 'AG-001',
        agentAddress: 'Jl. Melati no.20 Jakarta',
        orderDate: '25/06/2025',
        status: 'Selesai Produksi',
        noResi: 'RSI-890123',
        shippingDate: '26/06/2025',
        email: "majujaya@gmail.com",
        noRek: "1234567890",
        isActive: true,
        products: [
          { name: 'Mie Instan', quantity: 10 }
        ]
      },
      {
        id: 5,
        orderId: 'ORD-007',
        distributor: 'PT. Laris Makmur',
        agentId: 'AG-007',
        agentAddress: 'Jl. Salak no.20 Bandung',
        orderDate: '24/06/2025',
        status: 'Diterima',
        noResi: 'SHP123456',
        shippingDate: '24/06/2025',
        receivedDate: '27/06/2025', 
        paymentStatus: 'Lunas',
        email: "larismakmur@gmail.com",
        noRek: "1234567890",
        isActive: true,
        products: [
          { name: 'Beras Premium 5kg', quantity: 2 },
          { name: 'Minyak Goreng 1L', quantity: 1 },
        ]
      },
      {
        id: 6,
        orderId: 'ORD-008',
        distributor: 'PT. Sejahtera',
        agentId: 'AG-09',
        agentAddress: 'Jl. Sawo no.20 Purwokerto',
        orderDate: '24/06/2025',
        status: 'Diterima',
        noResi: 'SHP123456',
        shippingDate: '24/06/2025',
        receivedDate: '-', 
        paymentStatus: 'Belum Dibayar',
        email: "sejahtera@gmail.com",
        noRek: "1234567890",
        isActive: true,
        products: [
          { name: 'Beras Premium 5kg', quantity: 5 },
          { name: 'Minyak Goreng 1L', quantity: 1 },
        ]
      }
    ])
  );

  const updateResi = (orderId, noResi) => {
    setOrders(prev =>
      sortOrders(
        prev.map(order =>
          order.orderId === orderId
            ? {
                ...order,
                noResi,
                shippingDate: new Date().toLocaleDateString('id-ID'),
                status: 'Dikirim'
              }
            : order
        )
      )
    );
  };

  const markAsReceived = (orderId) => {
    setOrders(prev =>
      sortOrders(
        prev.map(order =>
          order.orderId === orderId
            ? {
                ...order,
                status: 'Diterima',
                receivedDate: new Date().toLocaleDateString('id-ID')
              }
            : order
        )
      )
    );
  };

  return (
    <OrderPabrikContext.Provider
      value={{
        orders,
        setOrders,
        updateResi,
        markAsReceived
      }}
    >
      {children}
    </OrderPabrikContext.Provider>
  );
};

export const useOrderPabrik = () => useContext(OrderPabrikContext);
