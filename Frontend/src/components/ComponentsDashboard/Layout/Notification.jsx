import React from 'react';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const Notification = ({ notifications = [], onMarkAsRead }) => {
    return (
        <div className="absolute top-8 right-16 bg-white border border-gray-200 rounded-lg shadow-md w-72 z-50 overflow-hidden">
            {/* Header Notifikasi */}
            <div className="bg-blue-800 text-white px-4 py-2 text-sm font-semibold">
                Notifikasi
            </div>

            {/* Isi Notifikasi */}
            <ul className="text-sm text-gray-700 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                    <li className="px-4 py-3 text-center text-gray-500">Tidak ada notifikasi</li>
                ) : (
                    notifications.map((notif, index) => (
                        <li
                            key={notif.id}
                            className={`hover:bg-gray-50 px-4 py-3 transition-colors cursor-pointer ${index !== notifications.length - 1 ? 'border-b border-gray-200' : ''
                                } ${notif.is_read ? 'bg-white' : 'bg-blue-50'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="pr-2">
                                    {notif.message}
                                    {!notif.is_read && (
                                        <div>
                                            <button
                                                onClick={() => onMarkAsRead(notif.id)}
                                                className="text-xs text-blue-600 hover:underline mt-1"
                                            >
                                                Tandai sudah dibaca
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 whitespace-nowrap text-right">
                                    {formatDate(notif.created_at || notif.date)}
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Notification;
