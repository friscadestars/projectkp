import React from 'react';
import bellIcon from '../../../assets/IconHeader/IconNotif.png';
import userIcon from '../../../assets/IconHeader/IconProfile.png';

const Header = ({ showDropdown, toggleDropdown }) => (
    <header className="bg-white shadow-md border-b border-gray-200 text-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center">
            <span className="text-xl font-bold text-blue-900">OrderLink</span>
        </div>
        <div className="flex items-center gap-4">
            <img src={bellIcon} alt="notifikasi" className="w-4 h-4" />
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
                        Beranda
                    </div>
                )}
            </div>
        </div>
    </header>
);

export default Header;
