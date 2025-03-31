'use client';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// Define the StudyLevel interface
export interface StudyLevel {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface StudyLevelsSectionProps {
  studyLevels: StudyLevel[];
  onClose: () => void;
}

export const StudyLevelsSection: React.FC<StudyLevelsSectionProps> = ({
  studyLevels,
  onClose,
}) => {
  // Get unique study levels and limit to top 5
  const uniqueLevels = studyLevels
    ?.filter(
      (level, index, self) =>
        index === self.findIndex((l) => l.name === level.name)
    )
    .slice(0, 5); // Limit to top 5

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-md">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-900  pb-2 flex items-center">
        <span className="flex-1">Study Levels</span>
      </h2>

      {/* List */}
      <div className="grid gap-2">
        {uniqueLevels.length > 0 ? (
          uniqueLevels.map((level) => (
            <Link
              key={level.id}
              href={`/course/degree/${level.slug}`}
              onClick={onClose}
              className="group flex items-center justify-between p-3 rounded-lg  hover:bg-blue-50 transition-all duration-200 hover:border-blue-200"
            >
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                  {level.name}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No study levels available.
          </p>
        )}
      </div>
    </div>
  );
};
