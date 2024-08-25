import React from 'react';
import { Typography } from 'antd';

const UniversityCampusesDetails = ({ campuses }: any) => {
  // Check if campuses is an array and has elements
  if (!Array.isArray(campuses) || campuses.length === 0) {
    return (
      <section className="py-4">
        <div className="bg-white">
          <p className="text-gray-500">No campus details available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4">
      <div className="bg-white">
        <ul className="mt-4">
          {campuses.map((campus: any) => (
            <li
              key={campus.id}
              className="mb-6 bg-[#EBF5FF] px-5 py-4 rounded-lg text-base font-Open_Sans "
            >
              <div className="flex items-center justify-between">
                <h1 className="text-base">Location:</h1>
                <h2 className="py-2 font-semibold  text-center">
                  {campus.location}
                </h2>
              </div>
              <div className="flex items-center justify-between mt-2">
                <h1 className="text-base">Email:</h1>
                <h2 className="py-2 font-semibold  text-center">
                  {campus.email}
                </h2>
              </div>
              <div className="flex items-center justify-between mt-2">
                <h1 className="text-base">Contact:</h1>
                <h2 className="py-2 font-semibold  text-center">
                  {campus.contact}
                </h2>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default UniversityCampusesDetails;
