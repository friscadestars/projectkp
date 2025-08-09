import React from 'react';

const StatusBadge = ({ status }) => {
    const colorMap = {
        'pending': 'bg-yellow-500',
        'approved': 'bg-green-600',
        'shipped': 'bg-cyan-600',
        'processing': 'bg-blue-500',
        'cancelled': 'bg-red-500',
        'delivered': 'bg-green-700',
        'unpaid': 'bg-red-600',
        'paid': 'bg-green-500',
    };

    const labelMap = {
        'pending': 'Tertunda',
        'approved': 'Disetujui',
        'shipped': 'Dikirim',
        'processing': 'Diproses',
        'cancelled': 'Ditolak',
        'delivered': 'Diterima',
        'unpaid': 'Belum Dibayar',
        'paid': 'Lunas',
    };

    const key = (status || '').toLowerCase();
    const colorClass = colorMap[key] || 'bg-gray-400';
    const label = labelMap[key] || status;

    return (
        <span className={`${colorClass} text-white px-4 py-1 rounded text-sm font-bold`}>
            {label}
        </span>
    );
};


export default StatusBadge;
