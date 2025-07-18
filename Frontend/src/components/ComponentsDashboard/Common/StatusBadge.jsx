import React from 'react';

const StatusBadge = ({ status }) => {
    const statusColors = {
        'Tertunda': 'bg-yellow-400 text-white font-bold',
        'Disetujui': 'bg-green-500',
        'Dikirim': 'bg-purple-500',
        'Diproses': 'bg-blue-500',
        'Ditolak': 'bg-red-500',
        'Diterima': 'bg-teal-600'
    };

    const colorClass = statusColors[status] || 'bg-gray-400';

    return (
        <span className={`${colorClass} text-white px-4 py-1 rounded text-sm font-bold`}>
            {status}
        </span>
    );
};

export default StatusBadge;
