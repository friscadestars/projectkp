import React, { useState, useEffect } from 'react';
import iconDropdown from '../../../assets/IconSidebar/Dropdown.png'; 
import { FaTimes } from 'react-icons/fa';

const Sidebar = ({ menuItems, activeLabel, onNavigate, isSidebarOpen, setIsSidebarOpen }) => {
    const [openMenus, setOpenMenus] = useState({});

    useEffect(() => {
        const stored = localStorage.getItem('openMenus');
        if (stored) {
            setOpenMenus(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('openMenus', JSON.stringify(openMenus));
    }, [openMenus]);

    const toggleMenu = (label) => {
        setOpenMenus(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    return (
        <>
            {/* Overlay untuk mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:static z-40 bg-blue-900 text-white min-h-screen w-64 px-4 py-3 transform transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0`}
            >
                {/* Close button untuk mobile */}
                <div className="flex justify-end md:hidden mb-4">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 text-white hover:text-gray-300"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <ul>
                    {menuItems.map((item, index) => {
                        const isActive =
                            item.label === activeLabel ||
                            item.subItems?.some(sub => sub.label === activeLabel);

                        return (
                            <li key={index} className="mb-2">
                                <div
                                    className={`flex items-center justify-between px-2 py-2 rounded cursor-pointer hover:bg-blue-800 ${isActive ? 'bg-blue-800' : ''}`}
                                    onClick={() => {
                                        if (item.subItems) {
                                            toggleMenu(item.label);
                                        } else {
                                            onNavigate(item.label);
                                            setIsSidebarOpen(false); 
                                        }
                                    }}
                                >
                                    <div className="flex items-center">
                                        <img src={item.icon} alt={item.label} className="w-16 h-19" />
                                        <span className="font-semibold">{item.label}</span>
                                    </div>

                                    {/* Dropdown icon */}
                                    {item.subItems && (
                                        <img
                                            src={iconDropdown}
                                            alt="dropdown"
                                            className={`w-3 h-3 transform transition-transform duration-200 ${openMenus[item.label] ? 'rotate-90' : 'rotate-0'}`}
                                        />
                                    )}
                                </div>

                                {/* Submenu */}
                                {item.subItems && openMenus[item.label] && (
                                    <ul className="ml-8 mt-1 space-y-1">
                                        {item.subItems.map((subItem, subIndex) => (
                                            <li
                                                key={subIndex}
                                                className={`cursor-pointer px-9 py-1 rounded hover:bg-blue-700 text-sm ${subItem.label === activeLabel
                                                    ? 'bg-blue-700 font-semibold'
                                                    : ''
                                                    }`}
                                                onClick={() => {
                                                    onNavigate(subItem.label);
                                                    setIsSidebarOpen(false); // Close sidebar on mobile
                                                }}
                                            >
                                                {subItem.label}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </aside>
        </>
    );
};

export default Sidebar;
