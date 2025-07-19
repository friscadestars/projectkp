import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bellIcon from '../../../assets/IconHeader/IconNotif.png';
import userIcon from '../../../assets/IconHeader/IconProfile.png';
import NotificationDropdown from './Notification';

const Header = ({ showDropdown, toggleDropdown, role }) => {
    const navigate = useNavigate();
    const [showNotif, setShowNotif] = useState(false); // Untuk toggle dropdown notif

    const toggleNotif = () => {
        setShowNotif((prev) => !prev);
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

    return (
        <header className="bg-white shadow-md border-b border-gray-200 text-gray-700 p-4 flex flex-wrap justify-between items-center w-full">
            <div className="flex items-center mb-2 md:mb-0">
                <span className="text-xl font-bold text-blue-900">OrderLink</span>
            </div>
            <div className="flex items-center gap-4 relative">
                {/* Ikon Notifikasi */}
                <button onClick={toggleNotif} className="relative">
                    <img src={bellIcon} alt="notifikasi" className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                        3
                    </span>
                </button>

                {/* Dropdown Notifikasi dari komponen terpisah */}
                {showNotif && <NotificationDropdown />}

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

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow px-10 py-3 text-sm z-50 text-gray-700">
                            <button
                                onClick={handleNavigateToBeranda}
                                className="hover:underline hover:text-blue-600"
                            >
                                Beranda
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
