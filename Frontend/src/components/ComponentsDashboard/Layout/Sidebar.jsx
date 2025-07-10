import React, { useState, useEffect } from 'react';
import iconDropdown from '../../../assets/IconSidebar/Dropdown.png'; // pastikan path-nya sesuai struktur proyekmu

const Sidebar = ({ menuItems, activeLabel, onNavigate }) => {
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
        <aside className="w-64 bg-blue-900 text-white min-h-screen px-4 py-6">
            <ul>
                {menuItems.map((item, index) => {
                    const isActive =
                        item.label === activeLabel ||
                        item.subItems?.some(sub => sub.label === activeLabel);

                    return (
                        <li key={index} className="mb-2">
                            <div
                                className={`flex items-center justify-between px-0 py-0 rounded cursor-pointer hover:bg-blue-800 ${isActive ? 'bg-blue-800' : ''}`}
                                onClick={() => {
                                    if (item.subItems) {
                                        if (item.path) onNavigate(item.label);
                                        toggleMenu(item.label);
                                    } else {
                                        onNavigate(item.label);
                                    }
                                }}
                            >
                                <div className="flex items-center gap-0">
                                    <img src={item.icon} alt={item.label} className="w-16 h-19" />
                                    <span className="font-bold">{item.label}</span>
                                </div>

                                {/* Tampilkan icon dropdown jika ada submenu */}
                                {item.subItems && (
                                    <img
                                        src={iconDropdown}
                                        alt="dropdown"
                                        className={`w-3 h-2 transform transition-transform duration-200 ${openMenus[item.label] ? 'rotate-90' : 'rotate-0'}`}
                                    />
                                )}
                            </div>

                            {item.subItems && openMenus[item.label] && (
                                <ul className="ml-14 mt-1 space-y-2">
                                    {item.subItems.map((subItem, subIndex) => (
                                        <li
                                            key={subIndex}
                                            className={`cursor-pointer px-3 py-1 rounded hover:bg-blue-700 text-sm ${subItem.label === activeLabel
                                                ? 'bg-blue-700 font-semibold'
                                                : ''
                                                }`}
                                            onClick={() => onNavigate(subItem.label)}
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
    );
};

export default Sidebar;
