// src/components/Common/Modal.jsx
import React from 'react';

const Modal = ({ children, onClose, title }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                {children}
                <button
                    className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Modal;
