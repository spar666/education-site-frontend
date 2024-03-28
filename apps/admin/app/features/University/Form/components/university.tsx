import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCSelect from 'apps/admin/components/SCForm/SCSelect';
import SCTextArea from 'apps/admin/components/SCForm/SCTextArea';
import SCWysiwyg from 'apps/admin/components/SCForm/SCWysiwyg';
import UniversitySchema from '../validation';
import { fetchCourses } from 'apps/admin/app/api/Course';
import { fetchAllUniversityByDestination } from 'apps/admin/app/api/Destinations';
import {
  addUniversity,
  fetchUniversityById,
  updateUniversity,
} from 'apps/admin/app/api/University';
import { zodResolver } from '@hookform/resolvers/zod';
import SCCheckbox from 'apps/admin/components/SCForm/SCCheckbox';
import { renderImage } from 'libs/services/helper';
import React from 'react';

interface ICreateUniversity {
  universityName: string;
  universityAddress: string;
  universityContactNumber: string;
  universityEmail: string;
  worldRanking: number;
  countryRanking: number;
  universityImage: string;
  description: string;
  tuitionFee: number;
  currency: string;
  financialAidAvailable: string;
  scholarshipDetails: string;
  course: string;
  destination: string;
}

function UniversityForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [availableCourse, setAvailableCourse] = useState<
    { courseName: string; id: string }[]
  >([]);

  const [selectedCourses, setSelectedCourses] = useState<
    { label: string; value: string }[]
  >([]);

  const [selectedDestination, setSelectedDestination] = useState<{
    name: string;
  }>({ name: '' });

  const [availableDestination, setAvailableDestination] = useState<
    { name: string; id: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ICreateUniversity>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseResponse, destinationsResponse] = await Promise.all([
          fetchCourses(),
          fetchAllUniversityByDestination(),
        ]);

        setAvailableCourse(courseResponse);
        setAvailableDestination(destinationsResponse);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (id) {
      fetchUniversityById({ id }).then((response) => {
        const cover = response.university.universityImage;
        const formattedCover = [
          {
            uid: cover,
            url: renderImage({ imgPath: cover, size: 'lg' }),
          },
        ];
        const financeDetails = response.university.financeDetails;

        const courses = response.university.courses.map((course: any) => ({
          label: course.courseName,
          value: course.id,
        }));

        setSelectedCourses(courses);

        const destination = response.university.destination;
        setSelectedDestination(destination);
        reset({
          universityName: response.university.universityName,
          universityAddress: response.university.universityAddress,
          universityEmail: response.university.universityEmail,
          universityContactNumber: response.university.universityContactNumber,
          worldRanking: response.university.worldRanking,
          countryRanking: response.university.countryRanking,
          description: response.university.description,
          universityImage:
            formattedCover.length > 0 ? formattedCover[0].url : '',
          tuitionFee: financeDetails.tuitionFee,
          currency: financeDetails.currency,
          financialAidAvailable: financeDetails.financialAidAvailable
            ? 'yes'
            : 'no',
          scholarshipDetails:
            financeDetails.scholarshipDetails === 'true' ? 'yes' : 'no',

          course: courses,
        });
      });
    }
  }, [id, reset]);

  const handleFormSubmit = async (data: ICreateUniversity) => {
    setLoading(true);

    const financeDetails = {
      tuitionFee: data?.tuitionFee,
      currency: data?.currency,
      financialAidAvailable:
        data?.financialAidAvailable[0] === 'yes' ? true : false,
      scholarshipDetails: data?.scholarshipDetails[0] === 'yes' ? true : false,
    };
    if (!id) {
      const universityData = {
        ...data,
        universityImage: data?.universityImage[0],

        financeDetails: financeDetails,
      };

      console.log(universityData, 'ud');

      addUniversity({ universityData })
        .then((response) => {
          if (response.status === 201) {
            router.push('/university');
            notification.success({
              message: response.data.message,
            });
          } else {
            notification.error({
              message: response.data.error(),
            });
          }
        })
        .catch((error) => {
          notification.error({ message: error.message });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const updatedData = {
        ...data,
        id: id,
        universityImage: data.universityImage || data?.universityImage[0],
      };
      updateUniversity({ updatedData })
        .then((response) => {
          if (response.status === 201) {
            router.push('/university');
            notification.success({
              message: response.data.message,
            });
          } else {
            notification.warning({
              message: response.data.message,
            });
          }
        })
        .catch((e) => {
          notification.error({ message: e.message });
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white px-8 pb-8"
    >
      <h3 className="text-xl font-bold mt-7 py-8 m-0">
        {id ? 'Edit' : 'Create'} University
      </h3>
      {/* University Name */}
      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <SCInput
            register={register}
            name="universityName"
            control={control}
            label="University Name"
            parentClass="flex-grow mb-4"
            error={errors?.universityName?.message}
            placeholder="University Name"
            size="large"
            required
          />
        </Col>
      </Row>
      {/* University Address */}
      <Row gutter={[20, 20]}>
        <Col xs={24} xl={24}>
          <SCInput
            register={register}
            name="universityAddress"
            control={control}
            label="University Address"
            parentClass="flex-grow mb-4"
            error={errors?.universityAddress?.message}
            placeholder="University Address"
            size="large"
          />
        </Col>
      </Row>
      {/* University Contact Number */}
      <Row gutter={[0, 0]}>
        <Col xs={24} xl={24}>
          <SCInput
            register={register}
            name="universityContactNumber"
            control={control}
            label="University ContactNumber"
            parentClass="flex-grow mb-4"
            error={errors?.universityContactNumber?.message}
            placeholder="University ContactNumber"
            size="large"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={24} xl={24}>
          <SCTextArea
            register={register}
            name="universityEmail"
            parentClass="flex-grow mb-4"
            control={control}
            label="University Email"
            error={errors?.universityEmail?.message}
            allowClear
            placeholder="University Email"
            size="large"
          />
        </Col>
      </Row>
      {/* Description */}
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <SCWysiwyg
            register={register}
            name="description"
            parentClass="flex-grow mb-4"
            control={control}
            label="Description"
            error={errors?.description?.message}
          />
        </Col>
      </Row>

      {/* University World Ranking */}
      <Row gutter={[0, 0]}>
        <Col xs={24} xl={24}>
          <SCInput
            register={register}
            name="worldRanking"
            control={control}
            label="University World Ranking"
            parentClass="flex-grow mb-4"
            error={errors?.universityContactNumber?.message}
            placeholder="University ContactNumber"
            size="large"
            type="number"
          />
        </Col>
      </Row>

      {/* University Country Ranking */}
      <Row gutter={[0, 0]}>
        <Col xs={24} xl={24}>
          <SCInput
            register={register}
            name="countryRanking"
            control={control}
            label="University Country Ranking"
            parentClass="flex-grow mb-4"
            error={errors?.universityContactNumber?.message}
            placeholder="University ContactNumber"
            size="large"
            type="number"
          />
        </Col>
      </Row>
      {/* Course */}
      <h3 className="text-xl font-bold mt-7 py-8 m-0">
        {id ? 'Edit' : 'Add'} Course
      </h3>
      {selectedCourses.map((selectedCourse) => (
        <Row key={selectedCourse?.value} gutter={[20, 20]}>
          <Col xs={24} xl={12}>
            <SCSelect
              key={selectedCourse?.value}
              register={register}
              parentClass="flex-grow mb-4"
              name={`course-${selectedCourse?.value}`}
              control={control}
              label="Course"
              error={errors?.course?.message}
              allowClear
              placeholder={`Please select ${selectedCourse?.label}`}
              size="large"
              // mode="course"
              notFoundContent={null}
              options={availableCourse?.map((ac) => ({
                label: ac?.courseName,
                value: ac?.id,
              }))}
              value={selectedCourse?.label}
              required
            />
          </Col>
        </Row>
      ))}

      {/* Destination */}
      <h3 className="text-xl font-bold mt-7 py-8 m-0">
        {id ? 'Edit' : 'Add'} Destination
      </h3>
      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <SCSelect
            register={register}
            parentClass="flex-grow mb-4"
            name="destination"
            control={control}
            label="Destination"
            error={errors?.destination?.message}
            allowClear
            placeholder="Please select destination"
            size="large"
            notFoundContent={null}
            options={availableDestination?.map(
              (ad: { name: string; id: string }) => ({
                label: ad.name,
                value: ad.id,
              })
            )}
            value={selectedDestination?.name}
            required
          />
        </Col>
      </Row>

      {/* finance */}
      <h3 className="text-xl font-bold mt-7 py-8 m-0">
        {id ? 'Edit' : 'Add'} Finance Details
      </h3>
      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <SCInput
            register={register}
            name="tuitionFee"
            control={control}
            label="University tuitionFee"
            parentClass="flex-grow mb-4"
            error={errors?.universityName?.message}
            placeholder="University tuitionFee"
            size="large"
            required
            type="number"
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <SCInput
            register={register}
            name="currency"
            control={control}
            label="currency"
            parentClass="flex-grow mb-4"
            error={errors?.currency?.message}
            placeholder="University tuitionFee"
            size="large"
            required
          />
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <SCCheckbox
            name="financialAidAvailable"
            control={control}
            label="Is Financial Aid Available?"
            parentClass="flex-grow mb-4"
            error={errors?.financialAidAvailable?.message}
            options={[
              {
                value: 'yes',
                label: 'Yes',
                description: 'Financial aid is available',
              },
              {
                value: 'no',
                label: 'No',
                description: 'No financial aid available',
              },
            ]}
            horizontal
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <SCCheckbox
            name="scholarshipDetails"
            control={control}
            label="Is Scholarship Available?"
            parentClass="flex-grow mb-4"
            error={errors?.scholarshipDetails?.message}
            horizontal
            options={[
              {
                value: 'yes',
                label: 'Yes',
                description: 'Financial aid is available',
              },
              {
                value: 'no',
                label: 'No',
                description: 'No financial aid available',
              },
            ]}
          />
        </Col>
      </Row>
      {/* University Image */}
      <Row>
        <SCUpload
          register={register}
          name="universityImage"
          control={control as any}
          label="University Image"
          error={errors?.universityImage?.message}
          required
          onFileUpload={function (urls: string[]): void {
            throw new Error('Function not implemented.');
          }}
        />
      </Row>
      {/* Form Buttons */}
      <Row>
        <div className="flex mt-4">
          <Button
            loading={loading}
            htmlType="submit"
            type="primary"
            size="large"
          >
            {id ? 'Update' : 'Create'}
          </Button>
          <Button
            htmlType="submit"
            onClick={() => router.push('/blogs')}
            className="ml-4"
            size="large"
          >
            Cancel
          </Button>
        </div>
      </Row>
    </form>
  );
}

export default UniversityForm;
