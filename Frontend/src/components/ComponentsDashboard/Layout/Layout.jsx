import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AgenLayout = ({ children, menuItems, activeLabel, onNavigate, showDropdown, toggleDropdown }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header showDropdown={showDropdown} toggleDropdown={toggleDropdown} />
            <div className="flex flex-grow">
                <Sidebar menuItems={menuItems} activeLabel={activeLabel} onNavigate={onNavigate} />
                <main className="flex-1 bg-gray-50 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AgenLayout;
