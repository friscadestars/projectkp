import React from 'react';
import PageHeader from '../../../Common/PageHeader';
import SearchInput from '../../../Common/SearchInput';
import MonitoringOrderTable from './MonitoringOrderTable';
import iconMonitoring from '../../../../../assets/IconHeader/MonitoringIcon.png';

const MonitoringOrderContent = ({ search, setSearch, filteredOrders }) => (
    <>
        <PageHeader icon={iconMonitoring} title="Monitoring Order" />

        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
            <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari Order ID"
                className="mb-4"
            />
            <MonitoringOrderTable orders={filteredOrders} />
        </div>
    </>
);

export default MonitoringOrderContent;
