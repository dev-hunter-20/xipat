'use client';

import React, { useMemo } from 'react';
import './ActiveDeactiveApp.scss';
import { Pie } from '@ant-design/plots';

export default function ActiveDeactiveApp({ statusApps }) {
  const data = useMemo(() => {
    return [
      {
        type: 'Active Apps',
        value: statusApps && statusApps[0] ? statusApps[0].app_count : 0,
      },
      {
        type: 'Deactive Apps',
        value: statusApps && statusApps[1] && statusApps[2] ? statusApps[1].app_count + statusApps[2].app_count : 0,
      },
    ];
  }, [statusApps]);

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent, value }) => `${value.toLocaleString()}`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    legend: {
      position: 'bottom',
      itemName: {
        formatter: (text, item) => {
          return `${text.length > 17 ? `${text.substring(0, 16)}...` : text}`;
        },
      },
    },
  };

  return (
    <div className="pie-chart">
      <Pie pieStyle={{ cursor: 'pointer' }} {...config} />
    </div>
  );
}
