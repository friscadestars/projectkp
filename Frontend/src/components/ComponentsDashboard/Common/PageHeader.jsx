// src/Components/Common/PageHeader.jsx
import React from 'react';

const PageHeader = ({ icon, title }) => (
    <h1 className="text-xl font-semibold text-blue-900 flex items-center gap-3 mb-6">
        <img src={icon} alt="icon" className="w-7 h-7" />
        {title}
    </h1>
);

export default PageHeader;
