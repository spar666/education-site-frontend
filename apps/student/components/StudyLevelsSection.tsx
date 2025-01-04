'use client';

import Link from 'next/link';

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

export const StudyLevelsSection = ({
  studyLevels,
  onClose,
}: StudyLevelsSectionProps) => (
  <div>
    <h1 className="block font-bold text-gray-900 pb-2 pl-2">Study Level</h1>
    <div className="flex flex-col">
      {Array.from(new Set(studyLevels?.map((item) => item?.name))).map(
        (name) => (
          <div onClick={onClose} key={name} className="text-lg">
            <Link
              href={`/course/degree/${
                studyLevels.find((item) => item.name === name)?.slug
              }`}
              className="text-base text-gray-800 pb-2 pl-2 hover:text-blue-500"
            >
              {name}
            </Link>
          </div>
        )
      )}
    </div>
  </div>
);
