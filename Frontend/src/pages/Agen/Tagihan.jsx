import React from 'react';
import AgenLayout from '../../components/ComponentsDashboard/Layout/Layout';
import PageHeaderWithIcon from '../../components/ComponentsDashboard/Common/PageHeader';
import SearchInput from '../../components/ComponentsDashboard/Common/SearchInput';
import TagihanTable from '../../components/ComponentsDashboard/Agen/Tagihan/TagihanTable';
import { useTagihanPageProps } from '../../hooks/Agen/Tagihan/useTagihanPageProps';

const Tagihan = () => {
    const props = useTagihanPageProps();

    return (
        <AgenLayout {...props.layoutProps}>
            <PageHeaderWithIcon {...props.pageHeaderProps} />
            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <SearchInput {...props.searchInputProps} />
                </div>
                <TagihanTable {...props.tagihanTableProps} />
            </div>
        </AgenLayout>
    );
};

export default Tagihan;
