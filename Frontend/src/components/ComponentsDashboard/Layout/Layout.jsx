import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { FaBars } from 'react-icons/fa';

const Layout = ({ children, menuItems, activeLabel, onNavigate, showDropdown, toggleDropdown, role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Header
                showDropdown={showDropdown}
                toggleDropdown={toggleDropdown}
                role={role} 
            />

            <button
                onClick={toggleSidebar}
                className="md:hidden p-3 m-3 text-white bg-primary-dark rounded z-50 absolute top-0 left-0"
            >
                <FaBars size={20} />
            </button>

            <div className="flex flex-grow relative">
                {/* Sidebar */}
                <Sidebar
                    menuItems={menuItems}
                    activeLabel={activeLabel}
                    onNavigate={onNavigate}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                {/* Main Content */}
                <main className="flex-1 bg-gray-50 p-8 relative z-0">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
