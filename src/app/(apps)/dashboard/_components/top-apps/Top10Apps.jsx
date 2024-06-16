'use client';

import { Column } from '@ant-design/plots';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import ModalAppMostReview from '../modal-app-most/ModalAppMostReview';

export default function Top10Apps({ appsMostReview, fromDate, toDate }) {
  const [showAppsDetail, setShowAppDetail] = useState(false);
  const dateFormat = "YYYY/MM/DD";

  const config = {
    data: appsMostReview ? appsMostReview : [],
    xField: 'name',
    yField: 'review_count',
    legend: {
      position: 'top-left',
    },
  };

  return (
    <>
      {showAppsDetail && (
        <ModalAppMostReview handleCancel={() => setShowAppDetail(false)} fromDate={fromDate} toDate={toDate} />
      )}
      <div className="chart-title flex justify-between">
        Top 10 applications has the most reviews{' '}
        <a
          className="chart-title-more flex justify-center items-center"
          href="/top-most-review?sort_by=best_match&page=1&per_page=20"
        >
          Show more{' '}
        </a>
      </div>
      <div className="chart-desc">
        Stage: {`${dayjs(fromDate).format(dateFormat)} - ${dayjs(toDate).format(dateFormat)}`}
      </div>
      <div className="dashboard-table">
        <Column columnStyle={{ cursor: 'pointer' }} {...config} />
      </div>
    </>
  );
}
