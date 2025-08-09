import React from 'react';
import PageHeaderWithIcon from '../../Common/PageHeader';
import SearchInput from '../../Common/SearchInput';
import TagihanDistributorTable from './TagihanDistributorTable';
import tagihanIcon from '../../../../assets/IconHeader/IconTagihan.png';

const TagihanDistributorContent = ({ searchTerm, setSearchTerm, orders, loading }) => (
    <>
        <PageHeaderWithIcon icon={tagihanIcon} title="Tagihan Anda" />
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
            <div className="mb-4">
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari Order ID"
                />
            </div>

            <TagihanDistributorTable
                orders={orders}
                searchTerm={searchTerm}
                loading={loading}
            />
        </div>
    </>
);

export default TagihanDistributorContent;
