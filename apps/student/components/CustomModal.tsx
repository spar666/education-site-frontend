import React, { useEffect, useState } from 'react';
import { Empty, Modal, Typography, Tabs, Button, Checkbox } from 'antd';
import { getCookie } from 'cookies-next';
import {
  fetchUniversitiesByIds,
  fetchUniversitiesByIdsForComapre,
} from '../app/api/university';
import { Icons } from './Icons';

const { TabPane } = Tabs;

const CustomModal = ({ visible, onClose }: any) => {
  const [favoriteData, setFavoriteData] = useState<string[] | null>(null);
  const [universities, setUniversities] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedUniversityIds, setSelectedUniversityIds] = useState<string[]>(
    []
  );
  const [comparisonModalVisible, setComparisonModalVisible] = useState(false);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (visible) {
          const favoriteDataFromCookies = getCookie('university');
          if (favoriteDataFromCookies !== undefined) {
            const favoriteDataArray = favoriteDataFromCookies.split(',');
            setFavoriteData(favoriteDataArray);
            const universitiesData = await fetchUniversitiesByIds(
              favoriteDataArray
            );
            setUniversities(universitiesData);
          } else {
            setFavoriteData([]);
            setUniversities([]);
          }
        } else {
          setFavoriteData(null);
          setUniversities([]);
        }
      } catch (error) {
        console.error('Failed to fetch universities:', error);
        setUniversities([]);
      }
    };

    fetchData();
  }, [visible]);

  const handleUniversityCompare = () => {
    console.log(selectedUniversityIds, 'uinids');
    setIsComparing(true);
    setShowCheckboxes(false);
    fetchComparisonData(selectedUniversityIds);
    setComparisonModalVisible(true);
  };

  const handleCheckboxChange = (uniId: string) => {
    setSelectedUniversityIds((prevIds) => {
      if (prevIds.includes(uniId)) {
        return prevIds.filter((id) => id !== uniId);
      } else {
        if (prevIds.length < 2) {
          return [...prevIds, uniId];
        } else {
          return prevIds;
        }
      }
    });
  };

  const fetchComparisonData = async (uniIds: string[]) => {
    try {
      const universitiesData = await fetchUniversitiesByIdsForComapre(uniIds);
      console.log(universitiesData, 'universitiesdat');
      setComparisonData(universitiesData);
      setComparisonModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch comparison data:', error);
    }
  };

  const handleComparisonModalClose = () => {
    setComparisonModalVisible(false);
    setIsComparing(false);
    setShowCheckboxes(true);
    setSelectedUniversityIds([]);
  };

  return (
    <>
      <Modal visible={visible} onCancel={onClose} footer={null}>
        <div className="flex flex-col h-[300px] w-[500px]">
          <h1 className="font-bold text-2xl">My Favorites</h1>
          <Tabs defaultActiveKey="1" tabPosition="top">
            <TabPane tab="University" key="1">
              <div className="flex justify-end mr-10 ">
                <Button
                  style={{
                    backgroundColor: 'blue',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                  disabled={
                    universities.length === 0 ||
                    selectedUniversityIds.length !== 2
                  }
                  onClick={handleUniversityCompare}
                >
                  {isComparing ? 'Comparing...' : 'Compare Universities'}
                </Button>
              </div>
              {isComparing && showCheckboxes && (
                <span className="font-bold text-red-500">
                  (Select two universities that you want to compare)*
                </span>
              )}

              {universities.length > 0 ? (
                universities.map((uni: any, index: number) => (
                  <div key={index} className="mb-4 flex items-center mt-2">
                    <Icons.logo className="h-10 w-10 md:h-16 md:w-16 rounded-full mr-4 bg-electric-violet" />
                    <div>
                      <Typography.Text className="font-bold">
                        {uni.universityName}
                      </Typography.Text>
                      <br />
                      <Typography.Text className="font-semibold">
                        {uni.destination?.name}
                      </Typography.Text>
                    </div>

                    <Checkbox
                      className="ml-auto mr-20"
                      disabled={
                        selectedUniversityIds.length === 2 &&
                        !selectedUniversityIds.includes(uni.id)
                      }
                      onChange={() => handleCheckboxChange(uni.id)}
                      checked={selectedUniversityIds.includes(uni.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="flex mx-auto justify-center my-10">
                  <Empty
                    description={
                      <Typography.Text className="text-2xl">
                        No universities found
                      </Typography.Text>
                    }
                  />
                </div>
              )}
            </TabPane>
          </Tabs>
        </div>
      </Modal>

      <Modal
        visible={comparisonModalVisible}
        onCancel={handleComparisonModalClose}
      >
        <div className="flex flex-col h-screen w-[480px]">
          <h1 className="font-bold text-2xl">Comparison</h1>
          <div className="grid grid-cols-2 gap-4">
            {comparisonData.map((uni: any, index: number) => (
              <div key={index} className="border border-gray-300 p-4">
                <span>University Name</span>
                <br />
                <Typography.Text className="font-bold">
                  {uni.universityName}
                </Typography.Text>
                <br />
                <span>Country</span>
                <br />
                <Typography.Text className="font-semibold">
                  {uni.destination?.name}
                </Typography.Text>

                <br />
                <span>World Ranking</span>
                <br />
                <Typography.Text className="font-semibold">
                  {uni.worldRanking}
                </Typography.Text>
                <br />
                <span>Country Ranking</span>
                <br />
                <Typography.Text className="font-semibold">
                  {uni.countryRanking}
                </Typography.Text>
                <br />
                <span>Tution Fees</span>
                <br />
                <Typography.Text className="font-semibold">
                  {uni?.financeDetails?.tuitionFee}{' '}
                  {uni?.financeDetails?.currency}
                </Typography.Text>

                <br />
                <span>Scholarship</span>
                <br />
                <Typography.Text className="font-semibold">
                  {uni?.financeDetails?.scholarshipDetails}
                </Typography.Text>
                <br />
                <span>Courses Avaiable</span>
                <br />
                <Typography.Text className="font-semibold">
                  {uni?.courses.map(({ course, index }: any) => (
                    <span key={course.id}>
                      {course.courseName}
                      {index !== uni.courses.length - 1 && <br />}
                    </span>
                  ))}
                </Typography.Text>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CustomModal;
