const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

// ordersApi.js
const mapOrder = (o) => ({
    orderId: String(o.id),
    orderCode: o.order_code ?? `ORD-${String(o.agent_order_no || 0).padStart(3, '0')}`,
    agentId: o.agen_id,
    id: Number(o.id),
    agenName: o.agen,
    distributorId: o.distributor_id,
    distributorName: o.distributor,
    alamat: o.note,
    orderDate: o.order_date?.split(' ')[0] ?? o.order_date,
    deliveryDate: o.delivery_date,
    status: o.status,
    note: o.note ?? '-',
    pabrik_id: o.pabrik_id ?? null,
    pabrikName: o.pabrik_name ?? 'Tidak diketahui',
    receivedDate: o.accepted_at?.split(' ')[0] ?? o.received_date?.split(' ')[0] ?? '-',
    trackingNumber: o.resi ?? o.no_resi ?? o.noResi ?? '-',

    products: (o.items || []).map(i => ({
        id: i.id,
        name: i.product_name,
        quantity: Number(i.quantity ?? 0),
        requestedPrice: Number(i.requested_price ?? i.unit_price ?? 0),
        unitPrice: Number(i.unit_price ?? 0),
        address: i.address ?? o.note ?? '',
    })),
});

export async function fetchOrders() {
    const res = await fetch(`${API_BASE}/orders`, { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Gagal mengambil orders');

    const json = await res.json();
    const data = json.data || json;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user?.role?.toLowerCase?.() || 'unknown';
    const userId = Number(user?.id);

    return (Array.isArray(data) ? data : [])
        .filter((o) => {
            if (role === 'agen') {
                return Number(o.agen_id) === userId;
            } else if (role === 'distributor') {
                return Number(o.distributor_id) === userId;
            } else {
                return true; // admin atau role lain: akses semua
            }
        })
        .map(mapOrder);
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
// ordersApi.js
export async function updateOrderStatus(id, status) {
    const order = await fetchOrderById(id); // Ambil dulu data lengkap order-nya

    // Cek apakah statusnya delivered
    const isDelivered = status.toLowerCase() === 'delivered';

    // Format waktu saat ini untuk accepted_at (format: YYYY-MM-DD HH:mm:ss)
    const now = new Date();
    const acceptedAt = now.toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:mm:ss"

    const payload = {
        agen_id: order.agentId,
        distributor_id: order.distributorId,
        pabrik_id: order.pabrik_id ?? null,
        order_date: order.orderDate + ' 00:00:00',
        note: order.alamat,
        status: status,
        ...(isDelivered && { accepted_at: acceptedAt }) // hanya kirim accepted_at jika status = delivered
    };

    const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
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
    console.log('🔥 RAW order detail from API:', data);
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
    const agenId = user?.id;

    // Pastikan array & filter hanya milik agen yang login
    const arr = Array.isArray(raw) ? raw : [];

    return arr
        .filter((o) => Number(o.agen_id) === Number(agenId))
        .map(mapOrder);
}

export async function fetchCompletedOrdersForHistory(role = 'agen') {
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
    const userId = Number(user?.id);
    const DONE = new Set(['delivered', 'selesai']);

    // Tentukan filter berdasarkan role
    const filtered = (Array.isArray(raw) ? raw : []).filter((o) => {
        const statusMatch = DONE.has(String(o.status || '').toLowerCase());

        if (role === 'agen') {
            return Number(o.agen_id) === userId && statusMatch;
        } else if (role === 'distributor') {
            return Number(o.distributor_id) === userId && statusMatch;
        }

        return false; // fallback
    });

    return filtered.map((o) => {
        const items = Array.isArray(o.items) ? o.items : [];

        const subtotalPabrik = items.reduce(
            (sum, i) => sum + Number(i.unit_price ?? 0) * Number(i.quantity ?? 0), 0
        );

        const subtotalJual = items.reduce(
            (sum, i) => sum + Number((i.requested_price ?? i.unit_price) ?? 0) * Number(i.quantity ?? 0), 0
        );

        return {
            id: String(o.id),
            orderId: o.id,
            agenName: o.agen,
            orderCode: o.order_code ?? `ORD-${String(o.id).padStart(3, '0')}`,
            distributorName: o.distributor ?? '-',
            orderDate: (o.order_date || '').split(' ')[0] || '-',
            receivedDate: (o.accepted_at || o.received_date || '').split(' ')[0] || '-',
            trackingNumber: o.resi ?? '-',
            totalPrice: subtotalJual,
            statusPembayaran: o.status_pembayaran ?? 'Belum Lunas',
            hargaJual: subtotalJual,
            hargaPabrik: subtotalPabrik,
            status: o.status ?? '-',
            products: items.map(i => ({
                nama: i.product_name,
                jumlah: i.quantity,
                hargaAgen: i.requested_price ?? i.unit_price,
                hargaPabrik: i.unit_price,
            })),
        };
    });
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

    const ALLOWED = new Set(['disetujui', 'approved', 'dikirim', 'shipped', 'selesai', 'delivered']);

    return (Array.isArray(raw) ? raw : [])
        .filter((o) => Number(o.agen_id) === Number(agenId))
        .map(mapOrder)
        .filter((o) => ALLOWED.has((o.status || '').toLowerCase()));
}

export async function deleteOrderById(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Gagal menghapus order');
    }

    return res.json();
}
