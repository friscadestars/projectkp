import React from 'react';
import ConfirmPaymentModal from './ConfirmPaymentModal';

const PaymentConfirmation = ({ showModal, setShowModal, onConfirm }) => (
    <>
        <div className="text-center">
            <button
                onClick={() => setShowModal(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700"
            >
                Konfirmasi Pembayaran
            </button>
        </div>
        {showModal && (
            <ConfirmPaymentModal
                onCancel={() => setShowModal(false)}
                onConfirm={onConfirm}
            />
        )}
    </>
);

export default PaymentConfirmation;
