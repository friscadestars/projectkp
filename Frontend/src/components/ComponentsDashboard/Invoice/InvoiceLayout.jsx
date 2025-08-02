import React from 'react';
import InvoiceDetails from './InvoiceDetails';
import InvoiceTable from './InvoiceTable';
import PaymentInstructions from './PaymentInstructions';
import PaymentConfirmation from './PaymentConfirmation';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // bulan dimulai dari 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

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
    console.log('Invoice Data:', invoiceData);

    if (!invoiceData) {
        return null;
    }

    // Pindahkan isPaid ke sini, agar bisa akses invoiceData
    const isPaid = ['lunas', 'paid'].includes(statusPembayaran?.toLowerCase());

    const invoice = invoiceData.tagihan || invoiceData.invoice;
    const products = invoiceData.products || invoiceData.tagihan?.items || [];
    const bankData = invoice?.pengirim_bank;

    return (
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-8 max-w-9xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-900 text-center">Invoice Pembayaran</h2>
            <p className="text-center text-sm text-gray-600 mb-6">
                Nomor Invoice: {invoice?.invoice_number} | Tanggal: {formatDate(invoice?.invoice_date)}
            </p>

            <InvoiceDetails
                invoiceData={invoiceData}
                showAgen={showAgen}
                showDistributor={showDistributor}
            />

            <InvoiceTable products={products} />

            <PaymentInstructions
                bankName={bankData?.nama_bank || '-'}
                accountName={bankData?.nama_rekening || '-'}
                accountNumber={bankData?.rekening || '-'}
            />

            {showConfirmationButton && (
                <div className="text-center mt-4">
                    <button
                        className={`px-6 py-2 rounded text-white
                          bg-green-600 hover:bg-green-700
                          disabled:bg-gray-400 disabled:cursor-not-allowed
                        `}
                        onClick={isPaid ? undefined : onOpenModal}
                        disabled={isPaid}
                    >
                        Konfirmasi Pembayaran
                    </button>
                </div>
            )}

            {showModal && (
                <PaymentConfirmation
                    onConfirm={onConfirmPayment}
                />
            )}
        </div>
    );
};

export default InvoiceLayout;