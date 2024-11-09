'use client';
import { useEffect, useState } from 'react';
import { Breadcrumb, Typography, Tabs } from 'antd';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import SubjectList from '../SubjectList';
import { fetchUniversitySubjectByUniversitySlug } from 'apps/student/app/api/university';
import DetailBanner from 'apps/student/components/DetailBanner';

const { Text } = Typography;
const { TabPane } = Tabs;

interface CourseDetailsProps {
  searchParams: {
    course: string;
    university: string;
  };
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ searchParams }) => {
  const { course, university } = searchParams;
  const [universityDetails, setUniversityDetails] = useState<any[]>([]);

  // Fetch university subjects based on course and university
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUniversitySubjectByUniversitySlug({
          course,
          university,
        });
        setUniversityDetails(response?.data);
      } catch (error) {
        console.error('Failed to fetch university:', error);
      }
    };

    fetchData();
  }, [course, university]);

  // Render the detail banner content
  const renderBannerContent = () => (
    <section className="py-4">
      <h1 className="text-white text-2xl md:text-3xl font-bold">
        All subject areas for Undergraduate courses.
      </h1>
      <h2 className="text-white text-xl mt-4">
        Explore the subject areas below to view related courses and find the
        course that’s right for you.
      </h2>
    </section>
  );

  // Render breadcrumb navigation
  const renderBreadcrumb = () => (
    <div className="container mx-auto my-3">
      <Breadcrumb separator=">">
        <Breadcrumb.Item className="text-dark-blue">Home</Breadcrumb.Item>
        <Breadcrumb.Item className="text-dark-blue">{course}</Breadcrumb.Item>
        <Breadcrumb.Item className="text-dark-blue">
          {university}
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );

  // Render university tabs
  const renderUniversityTabs = () => (
    <Tabs defaultActiveKey="0">
      {universityDetails.map((university, index) => {
        const subjects = university.courseSubject || [];

        // Use a Map to track unique subjects by their ID
        const uniqueSubjectsMap = new Map();

        // Populate the Map to ensure unique subjects and their financial details
        subjects.forEach((subject: any) => {
          const subjectId = subject.id; // Ensure this ID is unique for each subject

          if (!uniqueSubjectsMap.has(subjectId)) {
            // Access finance details from the subject's course
            const financeDetails = subject.course?.financeDetails || [];
            const levels = subject.course?.studyLevel;

            uniqueSubjectsMap.set(subjectId, {
              ...subject.subject,
              financeDetails: financeDetails[0],
              level: levels, // Associate finance details with this subject
            });
          }
        });

        // Convert the Map back to an array of unique subjects
        const uniqueSubjects = Array.from(uniqueSubjectsMap.values());

        return (
          <TabPane tab={university.universityName} key={university.id || index}>
            <div className="py-4">
              {uniqueSubjects.length > 0 ? (
                <SubjectList
                  subjects={uniqueSubjects}
                  level={uniqueSubjects[0].level}
                  financeDetails={uniqueSubjects[0].financeDetails}
                />
              ) : (
                <Text className="text-md text-navy-blue">
                  No subjects available for {university.universityName}.
                </Text>
              )}
            </div>
          </TabPane>
        );
      })}
    </Tabs>
  );

  return (
    <section className="mx-auto bg-white overflow-hidden">
      <DetailBanner height="h-[250px]" component={renderBannerContent()} />
      <MaxWidthWrapper>
        <section className="py-5 bg-white">{renderBreadcrumb()}</section>
        <section className="bg-white px-5 sm:px-10 md:px-14 lg:px-24">
          {renderUniversityTabs()}
        </section>
      </MaxWidthWrapper>
    </section>
  );
};

export default CourseDetails;
