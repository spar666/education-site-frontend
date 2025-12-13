import React from 'react';
import { IUniversity } from '../types';

interface OverviewProps {
    data: IUniversity;
}

const Overview: React.FC<OverviewProps> = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4">Overview</h2>
            <div
                className="text-slate-600 prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: data.description || '' }}
            />
        </div>
    );
};

export default Overview;
