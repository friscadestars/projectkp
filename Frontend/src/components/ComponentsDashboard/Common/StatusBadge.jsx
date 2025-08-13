// import React from 'react';

// const StatusBadge = ({ status }) => {
//     const colorMap = {
//         pending: 'bg-yellow-500',
//         approved: 'bg-green-600',
//         shipped: 'bg-cyan-600',
//         processing: 'bg-blue-500',
//         cancelled: 'bg-red-500',
//         delivered: 'bg-green-700',
//         unpaid: 'bg-red-600',
//         paid: 'bg-green-500',
//         'belum dikirim': 'bg-[#FF2F00]',
//     };

//     const labelMap = {
//         pending: 'Tertunda',
//         approved: 'Disetujui',
//         shipped: 'Dikirim',
//         processing: 'Sedang Diproduksi',
//         cancelled: 'Ditolak',
//         delivered: 'Diterima',
//         unpaid: 'Belum Dibayar',
//         paid: 'Lunas',
//         'belum dikirim': 'Belum Dikirim',
//     };

//     const key = (status || '').toLowerCase();
//     const colorClass = colorMap[key] || 'bg-gray-400';
//     const label = labelMap[key] || status;

//     return (
//         <span
//             className={`${colorClass} text-white rounded text-xs lg:text-sm font-bold inline-flex items-center justify-center px-3 py-1`}
//             style={{
//                 whiteSpace: 'nowrap',
//                 textAlign: 'center',
//             }}
//         >
//             {label}
//         </span>
//     );
// };

// export default StatusBadge;

// src/components/Common/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status, labelOverride }) => {
    const colorMap = {
        pending: 'bg-yellow-500',
        approved: 'bg-green-600',
        shipped: 'bg-cyan-600',
        processing: 'bg-blue-500',
        cancelled: 'bg-red-500',
        delivered: 'bg-green-700',
        unpaid: 'bg-red-600',
        paid: 'bg-green-500',
        'belum dikirim': 'bg-[#FF2F00]',
    };

    const labelMap = {
        pending: 'Tertunda',
        approved: 'Disetujui',
        shipped: 'Dikirim',
        processing: 'Sedang Diproduksi',
        cancelled: 'Ditolak',
        delivered: 'Diterima',
        unpaid: 'Belum Dibayar',
        paid: 'Lunas',
        'belum dikirim': 'Belum Dikirim',
    };

    const key = (status || '').toLowerCase();
    const colorClass = colorMap[key] || 'bg-gray-400';
    const label = labelOverride || labelMap[key] || status;

    return (
        <span
            className={`${colorClass} text-white rounded text-xs lg:text-sm font-bold inline-flex items-center justify-center px-3 py-1`}
            style={{
                whiteSpace: 'nowrap',
                textAlign: 'center',
            }}
        >
            {label}
        </span>
    );
};

export default StatusBadge;

