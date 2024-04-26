import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Form,
  Input,
  Button,
  Typography,
  Select,
  DatePicker,
  Checkbox,
  notification,
} from 'antd';
import { fetchStudyLevels } from '../../api/studyLevel';
import { fetchAllUniversityByDestination } from '../../api/studyDestination';
import { CountriesList } from '../../../../../libs/countiesList/countryList';
import { addUserForAppointment } from '../../api/user';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
const { Option } = Select;

interface ILevels {
  id: string;
  name: string;
}

interface IDestination {
  id: string;
  name: string;
}

type Inputs = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  startDate: string;
  dateOfBirth: string;
  nationality: string;
  destination: string;
  studyLevel: string;
  termsAndConditionsAccepted: boolean;
  counselingOption: string;
};

const RegisterForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const [counselingOption, setCounselingOption] = useState('');
  const [isTermsAndConditionsAccepted, setIsTermsAndConditionsAccepted] =
    useState(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [levels, setLevels] = useState<ILevels[]>([]);
  const [destinations, setDestinations] = useState<IDestination[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Import countries list
  const countries = CountriesList;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levelsResponse, destinationsResponse] = await Promise.all([
          fetchStudyLevels(),
          fetchAllUniversityByDestination(),
        ]);
        setLevels(levelsResponse);
        setDestinations(destinationsResponse);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDestinationChange = (value: string) => {
    setSelectedDestination(value);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
  };

  const hanldeNationalityChange = (value: string) => {
    setSelectedNationality(value);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data, 'data');
    try {
      setLoading(true);
      // Add selected nationality, destination, and level to the data object
      data.nationality = selectedNationality;
      data.destination = selectedDestination;
      data.studyLevel = selectedLevel;
      data.termsAndConditionsAccepted = isTermsAndConditionsAccepted;
      data.counselingOption = counselingOption;

      // Set the values for firstName, middleName, lastName, email, phone, startDate, and dateOfBirth
      data.firstName = firstName;
      data.middleName = middleName;
      data.lastName = lastName;
      data.email = email;
      data.phone = phone;
      data.startDate = startDate;
      data.dateOfBirth = dateOfBirth;

      console.log(data, 'all');
      addUserForAppointment({ data })
        .then((response) => {
          if (response.data.status === 201) {
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
    } catch (error) {
      console.error('Failed to submit form:', error);
      notification.error({ message: 'Failed to submit form' });
      setLoading(false);
    }
  };

  const handleCounselingOptionChange = (option: string) => {
    setCounselingOption(option);
    setValue('counselingOption', option); // Manually set the value in react-hook-form
  };

  return (
    <div className="flex bg-gray-100 justify-center font-['Open_Sans']">
      <div className="w-full max-w-md sm:w-full">
        <Form onFinish={handleSubmit(onSubmit)} className="px-8 pb-8">
          <div className="text-center mb-8">
            <h1 className="font-bold text-2xl text-dark-blue mt-5 text-center">
              Get Appointment
            </h1>
          </div>
          {/* First Name Input Field */}
          <Form.Item
            validateStatus={errors.firstName ? 'error' : ''}
            help={errors.firstName ? errors.firstName.message : null}
          >
            <Input
              placeholder="First Name"
              {...register('firstName')}
              className="flex-grow text-black mb-4 border-1 border-blue-500"
              style={{ height: '40px' }}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Item>
          {/* Middle Name Input Field */}
          <Form.Item
            validateStatus={errors.middleName ? 'error' : ''}
            help={errors.middleName ? errors.middleName.message : null}
          >
            <Input
              placeholder="Middle Name"
              {...register('middleName')}
              className="flex-grow text-black mb-4 border-1 border-blue-500"
              style={{ height: '40px' }}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </Form.Item>
          {/* Last Name Input Field */}
          <Form.Item
            validateStatus={errors.lastName ? 'error' : ''}
            help={errors.lastName ? errors.lastName.message : null}
          >
            <Input
              placeholder="Last Name"
              {...register('lastName')}
              className="flex-grow text-black mb-4 border-1 border-blue-500"
              style={{ height: '40px' }}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Item>
          {/* Email Input Field */}
          <Form.Item
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email ? errors.email.message : null}
          >
            <Input
              placeholder="Email"
              {...register('email')}
              className="flex-grow text-black mb-4 border-1 border-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          {/* Phone Input Field */}
          <Form.Item
            validateStatus={errors.phone ? 'error' : ''}
            help={errors.phone ? errors.phone.message : null}
          >
            <Input
              placeholder="Phone"
              {...register('phone')}
              className="flex-grow text-black mb-4 border-1 border-blue-500"
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Item>
          {/* Nationality Select Field */}
          <Form.Item
            validateStatus={errors.nationality ? 'error' : ''}
            help={errors.nationality ? errors.nationality.message : null}
          >
            {countries && countries.length > 0 ? (
              <Select
                showSearch
                placeholder="Nationality"
                {...register('nationality')}
                className="flex-grow text-black mb-4 border border-blue-500 rounded"
                onChange={hanldeNationalityChange}
                defaultValue={selectedNationality} // Use defaultValue instead of value
              >
                {countries.map((country) => (
                  <Option key={country.code} value={country.name}>
                    {country.name}
                  </Option>
                ))}
              </Select>
            ) : (
              <p>No countries available</p>
            )}
          </Form.Item>

          {/* Destination Select Field */}
          <Form.Item
            validateStatus={errors.destination ? 'error' : ''}
            help={errors.destination ? errors.destination.message : null}
          >
            <Select
              showSearch
              placeholder="Select Destination Country"
              {...register('destination')}
              className="flex-grow text-black mb-4 border border-blue-500 rounded"
              onChange={handleDestinationChange}
              defaultValue={selectedDestination} // Use defaultValue instead of value
            >
              {destinations.map((dest) => (
                <Option key={dest.id} value={dest.id}>
                  {dest.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* Level Select Field */}
          <Form.Item
            validateStatus={errors.studyLevel ? 'error' : ''}
            help={errors.studyLevel ? errors.studyLevel.message : null}
          >
            <Select
              showSearch
              placeholder="Select Level"
              {...register('studyLevel')}
              className="flex-grow text-black mb-4 border border-blue-500 rounded"
              onChange={handleLevelChange}
              defaultValue={selectedLevel} // Use defaultValue instead of value
            >
              {levels.map((level) => (
                <Option key={level.id} value={level.id}>
                  {level.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* Start Date Picker */}
          <Form.Item
            validateStatus={errors.startDate ? 'error' : ''}
            help={errors.startDate ? errors.startDate.message : null}
          >
            <DatePicker
              placeholder="Select Start Date"
              {...register('startDate')}
              className="flex-grow text-black mb-4 border-1 border-blue-500"
              style={{ width: '100%', height: '40px' }}
              onChange={(date, dateString) => {
                if (typeof dateString === 'string') {
                  setStartDate(dateString);
                }
              }}
              onBlur={() => {}}
            />
          </Form.Item>
          {/* Date of Birth Picker */}
          <Form.Item
            validateStatus={errors.dateOfBirth ? 'error' : ''}
            help={errors.dateOfBirth ? errors.dateOfBirth.message : null}
          >
            <DatePicker
              placeholder="Select Birth Date"
              {...register('dateOfBirth')}
              className="flex-grow text-black mb-4 border-1 border-blue-500"
              style={{ width: '100%', height: '40px' }}
              onChange={(date, dateString) => {
                if (typeof dateString === 'string') {
                  setDateOfBirth(dateString);
                }
              }}
              onBlur={() => {}}
            />
          </Form.Item>
          {/* Counseling Options */}
          <div className="flex flex-col space-y-3 mb-3 font-['Open_Sans']">
            <div
              className={`w-full md:w-60 h-10 px-4 py-2 bg-dark-blue text-white flex text-bold items-center rounded ${
                counselingOption === 'online' ? 'bg-blue-500 text-white' : ''
              }`}
              onClick={() => handleCounselingOptionChange('online')}
            >
              Online Counselling
            </div>
            <div
              className={`w-full md:w-60 h-10 px-4 py-2 bg-dark-blue text-white flex text-bold items-center rounded ${
                counselingOption === 'inPerson' ? 'bg-blue-500' : ''
              }`}
              onClick={() => handleCounselingOptionChange('inPerson')}
            >
              In Person Counselling
            </div>
          </div>
          {/* Terms and Conditions Checkbox */}
          <div className="flex flex-wrap">
            <Checkbox
              {...register('termsAndConditionsAccepted')}
              checked={isTermsAndConditionsAccepted}
              onChange={(e) =>
                setIsTermsAndConditionsAccepted(e.target.checked)
              }
            >
              I agree to the terms and conditions
            </Checkbox>
          </div>
          {/* Submit Button */}
          {isTermsAndConditionsAccepted && (
            <Form.Item>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                style={{ backgroundColor: '#003366', marginTop: '5px' }}
                loading={loading}
              >
                Get Appointment
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
