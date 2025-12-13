import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, AlertCircle, GraduationCap } from 'lucide-react';
import { ICourse } from '../types';

interface CourseListProps {
    courses: ICourse[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('All');

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterLevel === 'All' || course.studyLevel.name === filterLevel;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
            {/* Header / Controls */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-brand-600" />
                            Available Programs
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {filteredCourses.length} courses found
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none bg-white w-full sm:w-40 cursor-pointer"
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                            >
                                <option value="All">All Levels</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Postgraduate">Postgraduate</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Course Title</th>
                            <th className="px-6 py-4">Level</th>
                            <th className="px-6 py-4">Duration</th>
                            <th className="px-6 py-4 text-right">Tuition (Est.)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredCourses.map((course, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                                        {course.courseName}
                                    </div>
                                    {course.isFeatured && (
                                        <span className="inline-block mt-1 text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Featured</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${course.studyLevel.name === 'Undergraduate' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
                                        <GraduationCap className="w-3 h-3 mr-1" />
                                        {course.studyLevel.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        {course.duration || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-900">
                                    {course.fee || 'Contact Uni'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredCourses.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                    <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium">No matches found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
};

export default CourseList;
