import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, menuItems, activeLabel, onNavigate, showDropdown, toggleDropdown, role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header fixed */}
            <Header
                showDropdown={showDropdown}
                toggleDropdown={toggleDropdown}
                role={role}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Konten di bawah header diberi padding sesuai tinggi header */}
            <div className="flex flex-grow relative pt-[72px] min-h-[calc(100vh-72px)]">
                {/* Sidebar */}
                <Sidebar
                    menuItems={menuItems}
                    activeLabel={activeLabel}
                    onNavigate={onNavigate}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                {/* Main Content */}
                <main className="flex-1 bg-gray-50 p-8 relative z-0 overflow-y-auto max-h-[calc(100vh-72px)]">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
