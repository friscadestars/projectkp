import React from 'react';

const SummaryCard = ({ title, value }) => (
    <div className="relative bg-white border border-gray-200 shadow-md rounded-lg p-4 text-center">
        <div className="absolute top-0 left-0 h-full w-2 bg-blue-900 rounded-l-lg"></div>
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-gray-900 mt-2">{value}</div>
    </div>
);

export default SummaryCard;
