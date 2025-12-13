import React from 'react';
import { IUniversity } from '../types';

interface SidebarProps {
    data: IUniversity;
}

const Sidebar: React.FC<SidebarProps> = ({ data }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg mb-4">Quick Facts</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex justify-between">
                        <span>Ranking</span>
                        <span className="font-medium text-slate-900">#{data.worldRanking}</span>
                    </li>
                    <li className="flex justify-between">
                        <span>English Courses</span>
                        <span className="font-medium text-slate-900">{data.isEnglishCourseAvailable ? 'Yes' : 'No'}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
