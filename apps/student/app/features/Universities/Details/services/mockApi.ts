import { IUniversity } from '../types';

export const fetchUniversityData = async (): Promise<IUniversity> => {
    try {
        const response = await fetch('http://localhost:3001/api/university/slug/the-university-of-syndey');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return {
            universityName: data.universityName,
            universityAddress: data.campuses?.[0]?.location || 'Address not available',
            worldRanking: data.worldRanking,
            isEnglishCourseAvailable: data.isEnglishCourseAvailable,
            universityImage: data.universityImage,
            description: data.description,
            courseSubject: data.courseSubject?.map((subject: any) => ({
                course: {
                    courseName: subject.course.courseName,
                    studyLevel: {
                        name: subject.course.studyLevel?.name || 'Unknown Level',
                    },
                    duration: subject.course.duration,
                    fee: subject.course.fee,
                    isFeatured: subject.course.isFeatured
                }
            })) || []
        };
    } catch (error) {
        console.error("Error fetching university data:", error);
        throw error;
    }
};
