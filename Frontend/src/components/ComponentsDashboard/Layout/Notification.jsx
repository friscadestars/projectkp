import React from 'react';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const Notification = () => {
    // Contoh data notifikasi (bisa diganti dari backend)
    const notifications = [
        {
            id: 1,
            message: '✅ Pesanan baru masuk',
            date: '2025-07-19',
        },
        {
            id: 2,
            message: '⏳ Pesanan sedang diproses',
            date: '2025-07-18',
        },
        {
            id: 3,
            message: '📦 Pesanan telah dikirim',
            date: '2025-07-17',
        },
    ];

    return (
        <div className="absolute top-8 right-16 bg-white border border-gray-200 rounded-lg shadow-md w-72 z-50 overflow-hidden">
            {/* Header Notifikasi */}
            <div className="bg-blue-800 text-white px-4 py-2 text-sm font-semibold">
                Notifikasi
            </div>

            {/* Isi Notifikasi */}
            <ul className="text-sm text-gray-700">
                {notifications.map((notif, index) => (
                    <li
                        key={notif.id}
                        className={`hover:bg-gray-50 px-4 py-3 cursor-pointer transition-colors ${
                            index !== notifications.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="pr-2">{notif.message}</div>
                            <div className="text-xs text-gray-500 whitespace-nowrap">
                                {formatDate(notif.date)}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notification;


//contoh code notifikasi kalo untuk menyambungkan dengan backend

//import React, { useEffect, useState } from 'react';
// import { FaBell } from 'react-icons/fa';
// import api from '../../services/api';

// const NotificationDropdown = ({ userRole }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     fetchNotifications();
//   }, [userRole]);

//   const fetchNotifications = async () => {
//     try {
//       const res = await api.get(`/notifications?role=${userRole}`);
//       setNotifications(res.data);
//       setUnreadCount(res.data.filter(n => !n.read).length);
//     } catch (error) {
//       console.error("Gagal mengambil notifikasi", error);
//     }
//   };

//   const handleNotificationClick = async (notifId) => {
//     try {
//       await api.patch(`/notifications/${notifId}/read`);
//       fetchNotifications(); // refresh state
//     } catch (error) {
//       console.error("Gagal update notifikasi", error);
//     }
//   };

//   return (
//     <div className="relative inline-block text-left">
//       <button onClick={() => setShowDropdown(!showDropdown)} className="relative">
//         <FaBell className="text-gray-700 text-xl" />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {showDropdown && (
//         <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 max-h-72 overflow-y-auto">
//           <div className="p-2 text-sm font-medium border-b">Notifikasi</div>
//           {notifications.length === 0 ? (
//             <div className="p-2 text-gray-500">Tidak ada notifikasi</div>
//           ) : (
//             notifications.map((notif) => (
//               <div
//                 key={notif.id}
//                 onClick={() => handleNotificationClick(notif.id)}
//                 className={`p-2 cursor-pointer hover:bg-gray-100 ${
//                   notif.read ? 'text-gray-500' : 'font-semibold'
//                 }`}
//               >
//                 {notif.message}
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;
