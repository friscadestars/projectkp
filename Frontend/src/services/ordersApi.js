// Ubah sesuai base URL API kamu
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

// Helper untuk Authorization header
const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

// Map order response
const mapOrder = (o) => ({
    orderId: String(o.id),
    orderCode: o.order_code ?? `ORD-${String(o.agent_order_no || 0).padStart(3, '0')}`,
    agentId: o.agen_id,
    agenName: o.agen,
    distributorId: o.distributor_id,
    distributorName: o.distributor,
    alamat: o.note,
    orderDate: o.order_date,
    deliveryDate: o.delivery_date,
    status: o.status,
    products: (o.items || []).map(i => ({
        id: i.id,
        name: i.product_name,
        quantity: Number(i.quantity),
        unit_price: Number(i.unit_price),
        address: i.address
    }))
});


// Ambil semua order (jika untuk list)
export async function fetchOrders() {
    const res = await fetch(`${API_BASE}/orders`, {
        headers: {
            ...getAuthHeader()
        }
    });
    if (!res.ok) throw new Error('Gagal mengambil orders');

    const json = await res.json();
    const data = json.data || json; // antisipasi jika backend membungkus dalam { data }

    return data.map(mapOrder);
}

//Ambil order berdasarkan order_code (ord-001, dst)
export async function fetchOrderById(orderCode) {
    const res = await fetch(`${API_BASE}/orders/${orderCode}`, {
        headers: {
            ...getAuthHeader()
        }
    });

    if (!res.ok) throw new Error('Order tidak ditemukan');

    const json = await res.json();
    const data = json.data || json;

    return mapOrder(data);
}

// Update status order by order_code
export async function updateOrderStatus(orderCode, status) {
    const res = await fetch(`${API_BASE}/orders/${orderCode}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({ status })
    });

    if (!res.ok) throw new Error('Gagal update status order');

    return res.json();
}

// Update harga produk dalam order (by order_code)
export const updateOrderItemPrice = async (orderCode, productName, price) => {
    const response = await fetch(`${API_BASE}/orders/${orderCode}/update-item-price`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({
            product_name: productName,
            unit_price: price,
        }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Gagal memperbarui harga produk');
    }

    return response.json();
};
