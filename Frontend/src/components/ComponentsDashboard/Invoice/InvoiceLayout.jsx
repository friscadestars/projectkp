import React from 'react';
import InvoiceDetails from './InvoiceDetails';
import InvoiceTable from './InvoiceTable';
import PaymentInstructions from './PaymentInstructions';
import ConfirmPaymentModal from './ConfirmPaymentModal';

const InvoiceLayout = ({
    invoiceData,
    statusPembayaran,
    showModal,
    onOpenModal,
    onCloseModal,
    onConfirmPayment,
    showConfirmationButton = true,
    showAgen = false,
    showDistributor = false,
}) => {
    if (!invoiceData) return null;

    return (
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-8 max-w-9xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-900 text-center">Invoice Pembayaran</h2>
            <p className="text-center text-sm text-gray-600 mb-6">
                Nomor Invoice: {invoiceData.invoiceNumber} | Tanggal: {invoiceData.invoiceDate}
            </p>

            <InvoiceDetails
                invoiceData={invoiceData}
                statusPembayaran={statusPembayaran}
                showAgen={showAgen}
                showDistributor={showDistributor}
            />

            <InvoiceTable products={invoiceData.products || []} />

            <PaymentInstructions
                bankName={invoiceData.bankName}
                accountName={invoiceData.accountName}
                accountNumber={invoiceData.accountNumber}
            />

            {showConfirmationButton && statusPembayaran === 'Belum Lunas' && (
                <div className="text-center mt-4">
                    <button
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                        onClick={onOpenModal}
                    >
                        Konfirmasi Pembayaran
                    </button>
                </div>
            )}

            {showModal && (
                <ConfirmPaymentModal
                    onCancel={onCloseModal}
                    onConfirm={onConfirmPayment}
                />
            )}
        </div>
    );
};

export default InvoiceLayout;
