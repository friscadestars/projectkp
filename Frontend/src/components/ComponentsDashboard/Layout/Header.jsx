import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bellIcon from '../../../assets/IconHeader/IconNotif.png';
import userIcon from '../../../assets/IconHeader/IconProfile.png';
import NotificationDropdown from './Notification';
import useNotifications from '../../../hooks/useNotifications';
import { FiMenu } from 'react-icons/fi';
import { createPortal } from 'react-dom';

const Header = ({ showDropdown, toggleDropdown, role, setIsSidebarOpen }) => {
    const navigate = useNavigate();
    const [showNotif, setShowNotif] = useState(false);

    const toggleNotif = () => {
        setShowNotif((prev) => {
            const next = !prev;
            if (next) {
                markAllAsRead();
            }
            return next;
        });
    };

    const handleNavigateToBeranda = () => {
        if (role === 'agen') {
            navigate('/berandaAgen');
        } else if (role === 'pabrik') {
            navigate('/berandaPabrik');
        } else if (role === 'distributor') {
            navigate('/berandaDistributor');
        }
    };

    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const unreadCount = notifications.filter(n => String(n.is_read) === '0').length;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 text-gray-700 p-4 flex flex-wrap justify-between items-center w-full">
            <div className="flex items-center gap-3 mb-2 md:mb-0">
                {/* Tombol hamburger (mobile) */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 rounded hover:bg-gray-100"
                >
                    <FiMenu size={22} className="text-blue-900" />
                </button>

                <span className="text-xl font-bold text-blue-900">OrderLink</span>
            </div>

            <div className="flex items-center gap-4 relative">
                {/* Ikon Notifikasi */}
                <button onClick={toggleNotif} className="relative">
                    <img src={bellIcon} alt="notifikasi" className="w-4 h-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* Dropdown Notifikasi */}
                {showNotif && (
                    <NotificationDropdown
                        notifications={notifications}
                        onMarkAsRead={markAsRead}
                    />
                )}

                {/* Ikon Profile */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-full"
                    >
                        <img src={userIcon} alt="user" className="w-4 h-4" />
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showDropdown && createPortal(
                        <div
                            className="absolute right-4 top-14 bg-white border border-gray-300 rounded shadow px-10 py-3 text-sm z-[9999] text-gray-700"
                        >
                            <button
                                onClick={handleNavigateToBeranda}
                                className="hover:underline hover:text-blue-600"
                            >
                                Beranda
                            </button>
                        </div>,
                        document.body
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
