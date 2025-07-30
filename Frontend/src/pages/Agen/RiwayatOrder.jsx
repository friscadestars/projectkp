import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeaderWithIcon from '../../components/ComponentsDashboard/Common/PageHeader';
import FilterBarRiwayat from '../../components/ComponentsDashboard/Common/FilterBarRiwayat';
import OrderHistoryTable from '../../components/ComponentsDashboard/Agen/RiwayatOrder/OrderHistoryTable';
import { useRiwayatOrderPage } from '../../hooks/Agen/Riwayat/useRiwayatOrderPage';

// Util format
const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
        .toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const RiwayatOrder = () => {
    const props = useRiwayatOrderPage();
    const { loading, error, orderTableProps } = props;

    const [filteredOrders, setFilteredOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);

    // Simpan semua data saat pertama kali load
    useEffect(() => {
        if (orderTableProps.orders) {
            setFilteredOrders(orderTableProps.orders);
            setAllOrders(orderTableProps.orders);
        }
    }, [orderTableProps.orders]);

    // Fungsi Export ke Excel (menggunakan filtered data)
    const handleExportExcel = () => {
        const exportData = filteredOrders.map((order) => ({
            'Order ID': order.orderCode?.toUpperCase(),
            'Distributor': order.distributorName,
            'Tanggal Order': formatDate(order.orderDate),
            'Tanggal Terima': formatDate(order.receivedDate),
            'No. Resi': order.trackingNumber || '-',
            'Total Harga': order.totalPrice,
            'Status': order.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'RiwayatOrder');
        XLSX.writeFile(workbook, 'riwayat_order.xlsx');
    };

    // Fungsi Filter berdasarkan tanggal
    const onFilterDate = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        const result = allOrders.filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate >= startDate && orderDate <= endDate;
        });

        setFilteredOrders(result);
    };

    // Fungsi Reset filter
    const onResetFilter = () => {
        setFilteredOrders(allOrders);
    };

    return (
        <AgenLayout {...props.layoutProps} role="agen">
            <PageHeaderWithIcon {...props.pageHeaderProps} />

            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 mb-6">
                <FilterBarRiwayat
                    entries={orderTableProps.entries}
                    onEntriesChange={orderTableProps.onEntriesChange}
                    onExportExcel={handleExportExcel}
                    onFilterDate={onFilterDate}
                    onResetFilter={onResetFilter}
                />
                <div className="mt-4">
                    {loading ? (
                        <div className="text-center py-4 text-gray-500">Memuat data...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-4">
                            {error.message || 'Terjadi kesalahan saat memuat data'}
                        </div>
                    ) : (
                        <OrderHistoryTable {...orderTableProps} orders={filteredOrders} />
                    )}
                </div>
            </div>
        </AgenLayout>
    );
};

export default RiwayatOrder;
