import { Col, Skeleton } from 'antd';
import React from 'react';

function StatsLoader() {
  return (
    <Col className="gutter-row bg-white p-7" span={6}>
      <Skeleton active />
    </Col>
  );
}

export default StatsLoader;
