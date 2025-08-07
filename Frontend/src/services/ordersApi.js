export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const checkInvoiceExist = async (orderId) => {
    try {
        const res = await fetch(`${API_BASE}/invoices/order/${orderId}`, {
            headers: { ...getAuthHeader() },
        });
        const json = await res.json();
        return res.ok && json.exists;
    } catch (err) {
        console.error('Gagal cek invoice:', err.message);
        return false;
    }
};

// ordersApi.js
export const mapOrder = async (o) => {
    const base = {
        orderId: String(o.id),
        orderCode: o.order_code ?? `ORD-${String(o.agent_order_no || 0).padStart(3, '0')}`,
        id: Number(o.id),
        agenName: o.agenName ?? o.agen ?? o.agen_name ?? o.agent_name ?? 'Nama tidak ditemukan',
        distributorId: o.distributor_id,
        distributorName: o.distributor,
        alamat: o.note,
        orderDate: o.order_date?.split(' ')[0] ?? o.order_date,
        deliveryDate: o.delivery_date ?? o.deliveryDate ?? null,
        status: o.status,
        note: o.note ?? '-',
        pabrik_id: o.pabrik_id ?? null,
        pabrikName: o.pabrik_name
            ? o.pabrik_name
            : o.pabrik_id
                ? await fetchUserById(o.pabrik_id)
                : 'Pabrik tidak diketahui',

        receivedDate: o.accepted_at?.split(' ')[0] ?? o.received_date?.split(' ')[0] ?? '-',
        trackingNumber: o.resi ?? o.no_resi ?? o.noResi ?? '-',
        statusPembayaran: o.status_pembayaran ?? 'Belum Lunas',

        products: (o.items || []).map(i => ({
            id: i.id,
            name: i.product_name,
            quantity: Number(i.quantity ?? 0),
            requestedPrice: Number(i.requested_price ?? i.unit_price ?? 0),
            unitPrice: Number(i.unit_price ?? 0),
            address: i.address ?? o.note ?? '',
        })),
        items: o.items || []
    };

    base.invoiceExist = await checkInvoiceExist(o.id);

    if (o.agen_id) {
        base.agentId = Number(o.agen_id);
    } else if ((o.agen || o.agenName) && o.distributor_id) {
        try {
            const name = typeof o.agen === 'string' ? o.agen : o.agenName;
            const agent = await fetchAgentIdByName(name, o.distributor_id);
            base.agentId = agent;
        } catch (err) {
            console.warn('Gagal mendapatkan agentId:', err.message);
            base.agentId = null;
        }
    } else {
        base.agentId = null;
    }

    return base;
};

export async function fetchUserById(id) {
    try {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
        });

        if (!res.ok) {
            console.warn(`⚠️ Tidak bisa fetch user dengan ID ${id}, kode: ${res.status}`);
            return 'Tidak diketahui';
        }

        const json = await res.json();
        return json?.name || json?.username || 'Tidak diketahui';
    } catch (error) {
        console.error('Gagal fetch user:', error.message);
        return 'Tidak diketahui';
    }
}

export async function fetchOrders() {
    const res = await fetch(`${API_BASE}/orders`, { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Gagal mengambil orders');

    const json = await res.json();
    const data = json.data || json;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user?.role?.toLowerCase?.() || 'unknown';
    const userId = Number(user?.id);

    // Filter dulu secara sync
    const filtered = (Array.isArray(data) ? data : []).filter((o) => {
        if (role === 'agen') {
            return Number(o.agen_id) === userId;
        } else if (role === 'distributor') {
            return Number(o.distributor_id) === userId;
        } else {
            return true;
        }
    });

    // Gunakan Promise.all untuk resolve semua mapping async
    const orders = await Promise.all(filtered.map(mapOrder));
    return orders;
}

// idOrCode bisa numeric (3) atau ord-001, tapi dari FE kita kirim id numerik
export async function fetchOrderById(idOrCode) {
    const res = await fetch(`${API_BASE}/orders/${idOrCode}`, {
        headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Order tidak ditemukan');
    const json = await res.json();
    const data = json.data || json;
    return await mapOrder(data);
}

// Update status by ID (PUT /orders/:id)
// export async function updateOrderStatus(id, status) {
//     const order = await fetchOrderById(id); // Ambil dulu data lengkap order-nya

//     // Cek apakah statusnya delivered
//     const isDelivered = status.toLowerCase() === 'delivered';

//     // Format waktu saat ini untuk accepted_at (format: YYYY-MM-DD HH:mm:ss)
//     const now = new Date();
//     const acceptedAt = now.toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:mm:ss"

//     const payload = {
//         agen_id: order.agentId,
//         distributor_id: order.distributorId,
//         pabrik_id: 1,
//         order_date: order.orderDate + ' 00:00:00',
//         note: order.alamat,
//         status: status,
//         ...(isDelivered && { accepted_at: acceptedAt }) // hanya kirim accepted_at jika status = delivered
//     };

//     const res = await fetch(`${API_BASE}/orders/${id}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             ...getAuthHeader(),
//         },
//         body: JSON.stringify(payload),
//     });

//     if (!res.ok) throw new Error('Gagal update status order');

//     return res.json();
// }

export async function updateOrderStatus(id, status) {
    const payload = { status };

    // Kalau statusnya delivered, kirim accepted_at juga
    if (status.toLowerCase() === 'delivered') {
        const now = new Date();
        const acceptedAt = now.toISOString().slice(0, 19).replace('T', ' ');
        payload.accepted_at = acceptedAt;
    }

    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Gagal update status order');
    }

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
    try {
        const res = await fetch(`${API_BASE}/prices`, {
            headers: {
                ...getAuthHeader()
            }
        });

        if (!res.ok) throw new Error('Gagal mengambil harga pabrik');

        const json = await res.json();
        const data = json.data || json;

        // Filter hanya data dengan role 'pabrik'
        const pabrikOnly = data.filter((item) => item.role === 'pabrik');

        // Ubah menjadi format { 'produk a': harga }
        return pabrikOnly.reduce((acc, item) => {
            acc[item.nama_produk.toLowerCase().trim()] = item.harga;
            return acc;
        }, {});
    } catch (error) {
        console.error("Gagal memuat harga pabrik:", error);
        return {};
    }
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
    return await mapOrder(data);

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
    const res = await fetch(`${API_BASE}/orders/history`, {
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
    const DONE = new Set(['delivered', 'selesai', 'rejected', 'cancelled']);

    const filtered = (Array.isArray(raw) ? raw : []).filter((o) => {
        const statusMatch = DONE.has(String(o.status || '').toLowerCase());

        if (role === 'agen') {
            return Number(o.agen_id) === userId && statusMatch;
        } else if (role === 'distributor') {
            return Number(o.distributor_id) === userId && statusMatch;
        }

        return false;
    });

    return filtered.map((o) => {
        const products = Array.isArray(o.items) ? o.items.map(i => ({
            nama: i.product_name,
            jumlah: i.quantity,
            hargaAgen: i.requested_price ?? i.unit_price,
            hargaPabrik: i.unit_price,
        })) : [];

        const totalPrice = Array.isArray(o.items)
            ? o.items.reduce((sum, item) => sum + (Number(item.unit_price || 0) * Number(item.quantity || 0)), 0)
            : 0;

        return {
            id: String(o.id),
            orderId: o.id,
            agenName: o.agen,
            orderCode: o.order_code ?? `ORD-${String(o.id).padStart(3, '0')}`,
            distributorName: o.distributor ?? '-',
            orderDate: (o.order_date || '').split(' ')[0] || '-',
            receivedDate: (o.accepted_at || o.received_date || '').split(' ')[0] || '-',
            trackingNumber: o.resi ?? '-',
            totalHargaPabrik: o.totalHargaPabrik ?? 0,
            hargaJual: o.hargaJual ?? 0,
            statusPembayaran: o.statusPembayaran ?? 'Belum Lunas',
            status: o.status ?? '-',
            products,
            totalPrice,
        };
    });
}



export async function fetchInvoicesForAgent() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const agenId = user?.id;

    if (!agenId) {
        throw new Error('Agen ID tidak ditemukan');
    }

    const res = await fetch(`${API_BASE}/invoices/agent/${agenId}`, {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Gagal mengambil data tagihan');
    }

    const json = await res.json();
    const raw = json.data || json;

    return Array.isArray(raw) ? raw : [];
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

export const fetchAgentIdByName = async (agenName, distributorId) => {
    const res = await fetch(`${API_BASE}/agents?name=${encodeURIComponent(agenName)}&distributor_id=${distributorId}`, {
        headers: { ...getAuthHeader() }
    });

    if (!res.ok) throw new Error('Gagal mendapatkan agen');
    const json = await res.json();
    const data = json?.data || json;

    if (Array.isArray(data)) {
        return data.length > 0 ? data[0].id : null;
    }

    return data?.id ?? null;
};

