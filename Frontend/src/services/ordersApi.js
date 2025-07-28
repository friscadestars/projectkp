const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

// ordersApi.js
const mapOrder = (o) => ({
    orderId: String(o.id),
    orderCode: o.order_code ?? `ORD-${String(o.agent_order_no || 0).padStart(3, '0')}`,
    agentId: o.agen_id,
    agenName: o.agen,
    distributorId: o.distributor_id,
    distributorName: o.distributor,
    alamat: o.note,
    orderDate: o.order_date?.split(' ')[0] ?? o.order_date,
    deliveryDate: o.delivery_date,
    status: o.status,
    note: o.note ?? '-',
    pabrikName: o.pabrik_name ?? 'Tidak diketahui',
    receivedDate: o.received_date ?? o.receivedDate ?? '-',
    trackingNumber: o.no_resi ?? o.noResi ?? '-',

    products: (o.items || []).map(i => ({
        id: i.id,
        name: i.product_name,
        quantity: Number(i.quantity),
        requestedPrice: Number(i.requested_price ?? i.unit_price ?? 0),
        // Harga pabrik
        unitPrice: Number(i.unit_price ?? 0),

        address: i.address,
    })),
});

export async function fetchOrders() {
    const res = await fetch(`${API_BASE}/orders`, { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Gagal mengambil orders');
    const json = await res.json();
    const data = json.data || json;
    return data.map(mapOrder);
}

// idOrCode bisa numeric (3) atau ord-001, tapi dari FE kita kirim id numerik
export async function fetchOrderById(idOrCode) {
    const res = await fetch(`${API_BASE}/orders/${idOrCode}`, {
        headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Order tidak ditemukan');
    const json = await res.json();
    const data = json.data || json;
    return mapOrder(data);
}

// Update status by ID (PUT /orders/:id)
export async function updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
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

// Update harga produk dalam order (by ID)
export async function updateOrderItemPrice(id, productName, price) {
    const response = await fetch(`${API_BASE}/orders/${id}/update-item-price`, {
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
}

export async function fetchPabrikPrices() {
    const res = await fetch(`${API_BASE}/prices`, {
        headers: {
            ...getAuthHeader()
        }
    });
    if (!res.ok) throw new Error('Gagal mengambil harga pabrik');
    const json = await res.json();
    const data = json.data || json;

    // Buat jadi { 'Produk A': 10000, 'Produk B': 20000 }
    return data.reduce((acc, item) => {
        acc[item.nama_produk] = item.harga;
        return acc;
    }, {});
}

export async function fetchOrderDetailById(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });
    if (!res.ok) throw new Error('Gagal mengambil detail order');
    const json = await res.json();
    const data = json.data || json;
    return mapOrder(data);
}

export async function fetchOrdersForDashboard() {
    const res = await fetch(`${API_BASE}/orders`, {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Gagal mengambil data orders');
    }

    const json = await res.json();
    const raw = json.data || json;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log("🧾 User from localStorage:", user);
    const agenId = user?.id;

    // Pastikan array & filter hanya milik agen yang login
    const arr = Array.isArray(raw) ? raw : [];

    return arr
        .filter((o) => Number(o.agen_id) === Number(agenId))
        .map(mapOrder);
}

export async function fetchCompletedOrdersForHistory() {
    const res = await fetch(`${API_BASE}/orders`, {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });

    if (!res.ok) throw new Error('Gagal mengambil data orders');

    const json = await res.json();
    const raw = json.data || json;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const agenId = user?.id;

    return (Array.isArray(raw) ? raw : [])
        .filter((o) => {
            const status = (o.status || '').toLowerCase();
            return Number(o.agen_id) === Number(agenId) &&
                (status === 'received' || status === 'Selesai');
        })
        .map(mapOrder);
}

export async function fetchOrdersForBilling() {
    const res = await fetch(`${API_BASE}/orders`, {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Gagal mengambil data orders');
    }

    const json = await res.json();
    const raw = json.data || json;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const agenId = user?.id;

    const ALLOWED = new Set([
        'disetujui', 'approved',
        'dikirim', 'shipped',
        'selesai', 'received'
    ]);

    return (Array.isArray(raw) ? raw : [])
        .filter((o) => Number(o.agen_id) === Number(agenId))
        .map(mapOrder)
        .filter((o) => ALLOWED.has((o.status || '').toLowerCase()));
}
