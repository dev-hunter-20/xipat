'use client';

import React, { useState, useEffect, useRef } from 'react';
import './DeveloperDetail.scss';
import { Row, Col, Spin, Empty } from 'antd';
import { Pagination, Select } from 'antd';
import ItemDetailDeveloper from './ItemDetailDeveloper';
import { StarFilled } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';

const { Option } = Select;

function DeveloperDetail() {
  const pathname = usePathname();
  const [data, setData] = useState([]);
  const page = useRef(1);
  const [totalPage, setTotalPage] = useState();
  const parts = pathname.split('/');
  const lastPart = parts[parts.length - 1];
  const id = lastPart;
  const per_page = 24;
  const [selectValue, setSelectValue] = useState('review');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    asyncFetch(id, page.current).then(() => handleSelectChange('review'));
  }, []);

  const asyncFetch = async (id, page) => {
    setLoading(true);
    let result = await DashboardDeveloperApiService.getDetailDeveloper(id, page, per_page);
    if (result) {
      setData(result.data);
      setTotalPage(result.total);
    }
    setLoading(false);
  };

  const handleSelectChange = (value) => {
    setSelectValue(value);
    if (value === 'review') {
      setData((prevData) => {
        const sortedApps = [...prevData.apps].sort((a, b) => {
          return b.detail.review_count - a.detail.review_count;
        });

        return {
          ...prevData,
          apps: sortedApps,
        };
      });
    } else if (value === 'first launched') {
      setData((prevData) => {
        const sortedApps = [...prevData.apps].sort((a, b) => {
          return new Date(a.detail.launched) - new Date(b.detail.launched);
        });

        return {
          ...prevData,
          apps: sortedApps,
        };
      });
    }
  };

  const onChangePage = () => {
    asyncFetch(id, page.current);
  };
  const getLink =
    'https://apps.shopify.com/partners/' +
    id +
    `?utm_source=letsmetrix.com&utm_medium=developer&utm_content=${data ? data.name : ''}`;

  const getTitle = 'apps.shopify.com/partners/' + id;

  const style = { marginTop: '15px' };

  return (
    <Spin spinning={loading}>
      {data.apps ? (
        <div className="developer-detail container">
          <div className="list-developer-detail">
            <div className="info-developer-detail">
              <div>
                <h1 className="title-name">{data ? data.name : ''} </h1>
                <div className="amount-app">
                  <span>{data.apps && Object.keys(data.apps).length} apps</span>
                  <p>
                    <StarFilled className="icon-star" /> {data.avg_star} / {data.review_count} reviews
                  </p>
                </div>
                <div className="link">
                  <a target="_blank" href={getLink}>
                    {getTitle}
                  </a>
                </div>
              </div>
              <div>
                <label>Sort:</label>
                <Select className="sort-developer-detail" value={selectValue} onChange={handleSelectChange}>
                  <Option value="review">Review</Option>
                  <Option value="first launched">First launched</Option>
                </Select>
              </div>
            </div>
            <div className="body-developer-detail">
              <div className="list-item">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  {data.apps &&
                    data.apps.map((item, index) => {
                      return (
                        <Col style={style} className="gutter-row" lg={8} xs={12} md={12} key={'' + index}>
                          <ItemDetailDeveloper value={item} />
                        </Col>
                      );
                    })}
                </Row>
              </div>
            </div>
          </div>
          <div className="pagination flex justify-center">
            <Pagination
              pageSize={per_page}
              current={page.current}
              onChange={(pageNumber) => {
                page.current = pageNumber;
                onChangePage();
              }}
              total={totalPage}
              showSizeChanger={false}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total.toLocaleString('en-US')} apps`}
            />
          </div>
        </div>
      ) : (
        <Empty />
      )}
    </Spin>
  );
}

export default DeveloperDetail;
