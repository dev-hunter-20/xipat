'use client';

import { Breadcrumb, Button, Col, DatePicker, Empty, Pagination, Row, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import ItemApp from '@/components/category-collection/item-app/ItemApp';
import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import DashboardApiService from '@/api-services/api/DashboardApiService';
import './DetailReviewApps.scss';
import Link from 'next/link';

const { RangePicker } = DatePicker;

export default function DetailReviewApps() {
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const dateFormat = 'YYYY-MM-DD';
  const fromDate = useRef(dayjs().subtract(30, 'd').format(dateFormat));
  const toDate = useRef(dayjs().format(dateFormat));
  const perPage = params.per_page ? params.per_page : 20;
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [listApp, setListApp] = useState([]);
  const router = useRouter();
  const pathname = usePathname();

  const asyncFetch = async (fromDate, toDate, page, per_page) => {
    setLoading(true);
    const result = await DashboardApiService.getAppsMostReview(fromDate, toDate, page, per_page);
    if (result && result.code == 0) {
      setListApp(result.result);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
      setLoading(false);
    }
  };

  useEffect(() => {
    const newQueryParams = {
      ...params,
    };
    router.push(`${pathname}?${encodeQueryParams(newQueryParams)}`);
    asyncFetch(fromDate, toDate, page, perPage);
  }, []);

  const onChangePage = (page) => {
    let newParams = {
      ...params,
      page: page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    asyncFetch(fromDate.current, toDate.current, page, perPage);
  };

  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      fromDate.current = dates[0].format(dateFormat);
      toDate.current = dates[1].format(dateFormat);
    }
  };

  const disabledFutureDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const searchByDate = () => {
    asyncFetch(fromDate.current, toDate.current, page, perPage);
  };

  return (
    <Spin spinning={loading}>
      <div className="detail-categories">
        <div className="detail-categories-header">
          <div className="container">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href={'/'}>Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item style={{ color: 'white' }}>
                <Link href="/dashboard">Apps dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item style={{ color: 'white' }}>Top Most Review</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className="detail-categories-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">Top apps has the most reviews</h1>
              <div className="title-apps">{total} apps</div>
              <div className="title">
                <RangePicker
                  defaultValue={[dayjs(fromDate.current, dateFormat), dayjs(toDate.current, dateFormat)]}
                  format={dateFormat}
                  allowClear={false}
                  onChange={onChangeDateRange}
                  disabledDate={disabledFutureDate}
                />
                <Button type="primary" icon={<SearchOutlined />} style={{ marginLeft: '10px' }} onClick={searchByDate}>
                  Search
                </Button>
              </div>
            </div>
          </div>
          <div className="line-top"></div>
          <div className="detail-category">
            <div className="title-column">
              <Row>
                <Col className="title-styled" span={2}>
                  #
                </Col>
                <Col className="title-styled" span={10}>
                  App
                </Col>
                <Col className="title-styled" span={6}>
                  Highlights
                </Col>
                <Col className="title-styled flex justify-center" span={3}>
                  Rating
                </Col>
                <Col className="title-styled flex justify-center" span={2}>
                  Reviews
                </Col>
              </Row>
            </div>
            {listApp && listApp.length !== 0 ? (
              listApp.map((itemChild, index) => {
                return (
                  <ItemApp
                    key={index}
                    itemChild={{
                      ...(itemChild.detail.detail ? itemChild.detail.detail : itemChild.detail),
                      rank: perPage * (page - 1) + index + 1,
                    }}
                    isTopReview
                  />
                );
              })
            ) : (
              <Empty style={{ marginTop: '100px' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
          <div className="pagination">
            <Pagination
              pageSize={perPage}
              current={currentPage}
              onChange={(pageNumber) => {
                setCurrentPage(pageNumber);
                onChangePage(pageNumber);
              }}
              total={total}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}
