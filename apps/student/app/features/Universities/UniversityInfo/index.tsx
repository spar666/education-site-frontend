import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useState } from 'react';

export const UniversityInfo = ({ universityName, description }: any) => {
  //   const [activeKey, setActiveKey] = useState('Overview'); // State to track active tab

  //   const handleTabChange = (activeKey: string) => {
  //     setActiveKey(activeKey);

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-6 md:p-6 h-[400px] w-full bg-gray-50">
      <Tabs
        //   activeKey={activeKey}
        //   onChange={handleTabChange}
        className="text-black"
        style={{ color: 'black' }}
      >
        <TabPane tab="Overview" key="1">
          <div className="gap-3">{description}</div>
        </TabPane>
        <TabPane tab="Fees" key="2">
          <div className="gap-3">Fee</div>
        </TabPane>
        <TabPane tab="Eligibility" key="3">
          <div className="gap-3">Eligibiity</div>
        </TabPane>
        <TabPane tab="Requirements" key="4">
          <div className="gap-3">Requirement</div>
        </TabPane>
      </Tabs>
    </div>
  );
};
