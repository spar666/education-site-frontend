import React from 'react';
import { Card, Typography } from 'antd';

const UniversityFinanceDetails = ({ financeDetails }: any) => {
  return (
    <section className="py-4 flex flex-col gap-2">
      {/* <span className="text-bold text-gray-500 text-1xl">
        How much will it cost?
      </span>
      <div className="card-grid mt-5">
        <Card className="bg-white w-full">
          <Typography.Title level={5}> Tuition Fee</Typography.Title>
          <Typography.Paragraph>
            {financeDetails?.tuitionFee}( {financeDetails?.currency})
          </Typography.Paragraph>
        </Card>
        <Card className="bg-white w-full">
          <Typography.Title level={5}>Financial Aids</Typography.Title>
          <Typography.Paragraph>
            <span className="text-bold text-gray-500 text-1xl">
              {financeDetails?.financialAidAvailable ? 'Yes' : 'No'}
            </span>
          </Typography.Paragraph>
        </Card>
        <Card className="bg-white w-full">
          <Typography.Title level={5}>Scholarships</Typography.Title>
          <Typography.Paragraph>
            <span className="text-bold text-gray-500 text-1xl">
              {financeDetails?.scholarshipDetails === 'yes' ? 'Yes' : 'No'}
            </span>
          </Typography.Paragraph>
        </Card>
       
      </div> */}
      <div className="pl-10 pr-3 py-3 bg-[#EBF5FF] flex items-center justify-between">
        <h1 className="text-base">Tuition Fee</h1>
        <h2 className="bg-secondary-yellow  py-2 font-bold text-xl min-w-16 px-3 text-center">
          {financeDetails?.tuitionFee}( {financeDetails?.currency}
        </h2>
      </div>
      <div className="pl-10 pr-3 py-3 bg-[#EBF5FF] flex items-center justify-between">
        <h1 className="text-base">Financial Aids</h1>
        <h2 className="bg-secondary-yellow  py-2 font-bold text-xl w-16 px-3 text-center">
          {financeDetails?.financialAidAvailable ? 'Yes' : 'No'}
        </h2>
      </div>
      <div className="pl-10 pr-3 py-3 bg-[#EBF5FF] flex items-center justify-between">
        <h1 className="text-base">Scholarships</h1>
        <h2 className="bg-secondary-yellow  py-2 font-bold text-xl w-16 px-3 text-center">
          {financeDetails?.scholarshipDetails === 'yes' ? 'Yes' : 'No'}
        </h2>
      </div>
    </section>
  );
};

export default UniversityFinanceDetails;
