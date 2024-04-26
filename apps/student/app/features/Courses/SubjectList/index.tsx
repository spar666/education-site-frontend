import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Fragment, useState } from 'react';
import RegisterForm from '../../RegisterForm';

const SubjectList = ({
  subjects,
  level,
  financeDetails,
}: {
  subjects: any[];
  level: string;
  financeDetails: any;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const subjectsPerPage = 3; // Adjust according to your preference
  const totalSubjects = subjects.length;

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = subjects
    .flat()
    .slice(indexOfFirstSubject, indexOfLastSubject);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="subject-list-container font-['Open_Sans'] flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-3/5">
        {currentSubjects.length > 0 ? (
          <Fragment>
            <div className="grid gap-6 font-['Open_Sans'] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {currentSubjects.map((subject) => (
                <div
                  key={subject?.id}
                  className="bg-white w-full font-semibold rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300"
                >
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4 text-dark-blue">
                      {subject?.subjectName}
                    </h3>
                    <hr className="my-2" />
                    <p className="text-sm text-navy-blue">Level: {level}</p>
                    <p className="text-sm text-navy-blue">
                      Duration: {subject?.duration} years
                    </p>
                    <p className="text-sm text-navy-blue">
                      Start Date:{' '}
                      {subject?.startDate
                        ? new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'long',
                          }).format(new Date(subject.startDate))
                        : ''}
                    </p>
                    <p className="text-sm text-navy-blue">
                      Fees: {financeDetails?.tuitionFee}{' '}
                      {financeDetails?.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <button
                className={`rounded-full p-2 border ${
                  currentPage === 1
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                }`}
                disabled={currentPage === 1}
                onClick={() => handleChangePage(currentPage - 1)}
              >
                <ChevronLeft />
              </button>
              <span className="mx-4 text-gray-600">{`Page ${currentPage} of ${Math.ceil(
                totalSubjects / subjectsPerPage
              )}`}</span>
              <button
                className={`rounded-full p-2 border ${
                  currentPage === Math.ceil(totalSubjects / subjectsPerPage)
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                }`}
                disabled={
                  currentPage === Math.ceil(totalSubjects / subjectsPerPage)
                }
                onClick={() => handleChangePage(currentPage + 1)}
              >
                <ChevronRight />
              </button>
            </div>
          </Fragment>
        ) : (
          <p className="text-center mt-8 text-gray-600">No subjects found</p>
        )}
      </div>
      <div className="mb-5 w-full md:w-2/5">
        <div className="rounded-lg w-full px-5 flex justify-center shadow-md flex flex-col justify-between h-full">
          <div className="flex-1">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectList;
