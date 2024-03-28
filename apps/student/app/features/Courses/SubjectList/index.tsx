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
  const subjectPerPage = 10;
  const totalSubjects = subjects.length;

  const indexOfLastSubject = currentPage * subjectPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectPerPage;
  const currentSubjects = subjects
    .flat()
    .slice(indexOfFirstSubject, indexOfLastSubject);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="subject-list-container p-6 flex flex-col md:flex-row">
      <div className="w-full md:w-3/5 mr-0 md:mr-6 mb-6 md:mb-0">
        {currentSubjects.length > 0 ? (
          <Fragment>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {currentSubjects.map((subject) => (
                <div
                  key={subject?.id}
                  className="bg-white gap-4 rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      {subject?.subjectName}
                    </h3>
                    <p className="text-sm text-gray-600">Level: {level}</p>
                    <p className="text-sm text-gray-600">
                      Duration: {subject?.duration} years
                    </p>
                    <p className="text-sm text-gray-600">
                      Start Date:{' '}
                      {subject?.startDate
                        ? new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'long',
                          }).format(new Date(subject.startDate))
                        : ''}
                    </p>
                    <p className="text-sm text-gray-600">
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
                totalSubjects / subjectPerPage
              )}`}</span>
              <button
                className={`rounded-full p-2 border ${
                  currentPage === Math.ceil(totalSubjects / subjectPerPage)
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                }`}
                disabled={
                  currentPage === Math.ceil(totalSubjects / subjectPerPage)
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
      <div className="w-full md:w-2/5">
        <div className="rounded-lg shadow-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default SubjectList;
