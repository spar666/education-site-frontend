import React from 'react';
import { Tabs } from 'antd';

interface GenericTabsProps<T extends object> {
  items: T[];
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
}

const GenericTabs: React.FC<GenericTabsProps<any>> = ({
  items,
  defaultActiveKey,
  onChange,
}) => {
  return (
    <Tabs
      defaultActiveKey={defaultActiveKey}
      items={items}
      onChange={onChange}
    />
  );
};

export default GenericTabs;
