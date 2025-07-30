import React from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeaderWithIcon from '../../components/ComponentsDashboard/Common/PageHeader';
import SearchInput from '../../Components/ComponentsDashboard/Common/SearchInput';
import TagihanTable from '../../components/ComponentsDashboard/Agen/Tagihan/TagihanTable';
import { useTagihanPageProps } from '../../hooks/Agen/Tagihan/useTagihanPageProps';

const Tagihan = () => {
    const props = useTagihanPageProps();
    const { loading, error } = props;

    return (
        <AgenLayout {...props.layoutProps} role="agen">
            <PageHeaderWithIcon {...props.pageHeaderProps} />
            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <SearchInput {...props.searchInputProps} />
                </div>
                {loading ? (
                    <div className="text-center text-gray-500">Memuat data...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error.message || 'Gagal memuat tagihan'}</div>
                ) : (
                    <TagihanTable {...props.tagihanTableProps} />
                )}
            </div>
        </AgenLayout>
    );
};

export default Tagihan;