import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext'; // pastikan path-nya sesuai

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const useNotifications = () => {
    const { user, token } = useAuth(); // Ambil dari context
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        if (!user?.id || !token) return;

        const res = await fetch(`${BASE_URL}/notifications?user_id=${user.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (res.ok) {
            const data = await res.json();
            setNotifications(data);
        }
    };

    const markAsRead = async (notifId) => {
        if (!token) return;

        const res = await fetch(`${BASE_URL}/notifications/${notifId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ is_read: 1 }),
        });

        if (res.ok) {
            fetchNotifications();
        }
    };

    const markAllAsRead = async () => {
        if (!token || !user?.id) return;

        // Ambil semua ID notifikasi yang belum dibaca
        const unreadNotifIds = notifications
            .filter(n => String(n.is_read) === '0')
            .map(n => n.id);

        // Kirim request PUT satu per satu (atau kamu bisa buat endpoint mass update nanti)
        await Promise.all(unreadNotifIds.map(id =>
            fetch(`${BASE_URL}/notifications/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ is_read: 1 }),
            })
        ));

        // Refresh notifikasi
        fetchNotifications();
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // tiap 10 detik
        return () => clearInterval(interval);
    }, [user?.id, token]);

    return { notifications, fetchNotifications, markAsRead, markAllAsRead };
};

export default useNotifications;
