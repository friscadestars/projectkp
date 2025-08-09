import React from 'react';
import PageHeader from '../../Common/PageHeader';
import SearchInput from '../../Common/SearchInput';
import DistributorTable from './DistributorTable';
import iconMonitoring from '../../../../assets/IconHeader/MonitoringIcon.png';

const MonitoringDistributorContent = ({ searchTerm, setSearchTerm, filteredDistributorList, toggleAktif }) => {
    console.log("📦 Data distributorList diterima:", filteredDistributorList);

    return (
        <>
            <PageHeader icon={iconMonitoring} title="Monitoring Distributor" />
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <div className="mb-4">
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari Distributor berdasarkan nama, email, atau alamat"
                    />
                </div>

                <DistributorTable distributorList={filteredDistributorList} toggleAktif={toggleAktif} />
            </div>
        </>
    );
};

export default MonitoringDistributorContent;
