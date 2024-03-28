import { Col } from 'antd';
import React from 'react';
import StatsLoader from '../StatsLoader';

function SCAdminCard({ loader, title, icon, count }: any) {
  const style: React.CSSProperties = { background: '#fff', height: '176px' };

  return count != 0 ? (
    <>
      {loader ? (
        <StatsLoader />
      ) : count ? (
        <Col className="gutter-row" span={6}>
          <div style={style} className="py-4 px-4 rounded">
            <h1 className="text-[#A7A7A7] text-xs 2xl:text-[18px] ">{title}</h1>
            <div className="flex items-center justify-between px-2 mt-10">
              <h1 className="text-2xl  2xl:text-5xl font-bold text-[#001529]">
                {count}
              </h1>
              <div className="bg-[#f0f2f5] py-2 px-3  2xl:py-4 2xl:px-5 rounded-xl">
                <img src={icon} className=" w-8 2xl:w-10 h-8 2xl:h-10" />
              </div>
            </div>
          </div>
        </Col>
      ) : null}
    </>
  ) : null;
}

export default SCAdminCard;
