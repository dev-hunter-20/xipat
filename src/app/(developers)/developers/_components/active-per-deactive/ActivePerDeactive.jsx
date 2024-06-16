'use client';

import React from 'react';
import { Pie } from '@ant-design/plots';

const ActivePerDeactive = (props) => {
  const config = {
    appendPadding: 10,
    data: props.data,
    angleField: 'value',
    colorField: 'type',
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    legend: {
      position: 'right',
      itemName: {
        formatter: (text, item) => {
          return `${text.length > 17 ? `${text.substring(0, 16)}...` : text}`;
        },
      },
    },
  };
  return (
    <div className="pie-chart">
      <Pie {...config} />
    </div>
  );
};

export default ActivePerDeactive;
