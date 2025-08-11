import React from 'react';
import PageHeader from '../../../Common/PageHeader';
import SearchInput from '../../../Common/SearchInput';
import AgenTable from './AgenTable';
import iconMonitoring from '../../../../../assets/IconHeader/MonitoringIcon.png';

const MonitoringAgenContent = ({ searchTerm, setSearchTerm, filteredAgenList, toggleAktif }) => {
    return (
        <>
            <PageHeader icon={iconMonitoring} title="Monitoring Agen" />
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <div className="mb-4">
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari Agen"
                    />
                </div>

                <AgenTable agenList={filteredAgenList} toggleAktif={toggleAktif} />
            </div>
        </>
    );
};

export default MonitoringAgenContent;
