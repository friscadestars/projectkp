import React from 'react';
import SummaryCard from './SummaryCard';

const DashboardSummary = ({ cards }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {cards.map((card, index) => (
                <SummaryCard key={index} title={card.title} value={card.value} />
            ))}
        </div>
    );
};

export default DashboardSummary;
