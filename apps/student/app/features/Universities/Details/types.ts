export interface ICourse {
    courseName: string;
    studyLevel: {
        name: string;
    };
    duration?: string;
    fee?: string;
    isFeatured?: boolean;
}

export interface IUniversity {
    universityName: string;
    universityAddress: string;
    worldRanking?: number;
    isEnglishCourseAvailable?: boolean;
    universityImage: string;
    description?: string;
    courseSubject: {
        course: ICourse;
    }[];
}

export enum Tab {
    OVERVIEW = 'overview',
    COURSES = 'courses',
}
