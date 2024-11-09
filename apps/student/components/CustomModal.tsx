import React, { useEffect, useState } from 'react';
import { Empty, Modal, Typography, Tabs, Button, Checkbox } from 'antd';
import { getCookie } from 'cookies-next';
import {
  fetchUniversitiesByIds,
  fetchUniversitiesByIdsForCompare,
} from '../app/api/university';
import { Icons } from './Icons';
import { renderImage } from 'libs/services/helper';
import Image from 'next/image';

const { TabPane } = Tabs;

const CustomModal = ({ visible, onClose }: any) => {
  const [favoriteData, setFavoriteData] = useState<string[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
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
          const favoriteDataArray = favoriteDataFromCookies
            ? favoriteDataFromCookies.split(',')
            : [];
          console.log(favoriteDataArray, 'favoriteDataArray');
          setFavoriteData(favoriteDataArray);
          const universitiesData = await fetchUniversitiesByIds(
            favoriteDataArray
          );
          setUniversities(universitiesData);
        } else {
          setFavoriteData([]);
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
      const universitiesData = await fetchUniversitiesByIdsForCompare(uniIds);
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
        <div className="flex flex-col h-[350px] w-[500px] f">
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
                    <Image
                      src={renderImage({
                        imgPath: uni?.universityImage,
                        size: 'sm',
                      })}
                      alt="University Image"
                      className="object-cover w-16 h-16 md:w-24 md:h-24"
                      width={100}
                      height={100}
                    />
                    <div className="ml-4">
                      <Typography.Text className="font-bold">
                        {uni.universityName}
                      </Typography.Text>
                      <br />
                      <Typography.Text className="font-semibold">
                        {uni.destination?.name}
                      </Typography.Text>
                    </div>

                    <Checkbox
                      className="ml-auto mr-4"
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
        <div className="flex flex-col h-screen w-[480px] f">
          <h1 className="font-bold text-2xl text-center mb-4">Comparison</h1>
          <div className="grid grid-cols-2 gap-4">
            {comparisonData.map((uni: any, index: number) => (
              <div
                key={index}
                className="border border-gray-300 p-4 flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <Image
                    src={renderImage({
                      imgPath: uni?.universityImage,
                      size: 'sm',
                    })}
                    alt="University Image"
                    className="object-cover w-16 h-16 md:w-24 md:h-24 mr-4"
                    width={100}
                    height={100}
                  />
                  <div>
                    <p className="font-bold">{uni.universityName}</p>
                    <p className="font-semibold">{uni.destination?.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="font-semibold">World Ranking:</span>
                    <span>{uni.worldRanking}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Country Ranking:</span>
                    <span>{uni.countryRanking}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Tuition Fees:</span>
                    <span>
                      {uni?.financeDetails?.tuitionFee}{' '}
                      {uni?.financeDetails?.currency}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Scholarship:</span>
                    <span>{uni?.financeDetails?.scholarshipDetails}</span>
                  </div>
                  <div className="col-span-2 flex flex-col">
                    <span className="font-semibold">Courses:</span>
                    <ul className="list-disc list-inside">
                      {uni.courses.map((course: any, index: number) => (
                        <li key={index}>{course.courseName}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CustomModal;
