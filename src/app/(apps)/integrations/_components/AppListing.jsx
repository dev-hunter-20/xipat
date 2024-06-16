'use client';

import DashboardApiService from '@/api-services/api/DashboardApiService';
import { options } from '@/utils/FilterOption';
import { encodeQueryParams, getParameterQuery, renderFilterDropdown } from '@/utils/functions';
import { Card, Col, Menu, Pagination, Row, Spin } from 'antd';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import ModalDetailApps from './modal/ModalDetailApps';
import './AppListing.scss'

export default function AppListing() {
  const [data, setData] = useState([]);
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [showDetail, setShowDetail] = useState(false);
  const [total, setTotal] = useState();
  const id = useRef();

  useEffect(() => {
    fetchData(page, perPage, sortBy);
  }, [sortBy]);

  const onChangePage = (page) => {
    let newParams = {
      ...params,
      page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    fetchData(page, perPage, sortBy);
  };

  async function fetchData(page, per_page, sort_by) {
    setIsLoading(true);
    let result = await DashboardApiService.getIntegrations(page, per_page, sort_by);
    if (result) {
      setData(result.result);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
    }
    setIsLoading(false);
  }

  const onClickShow = (value) => {
    setShowDetail(true);
    id.current = value;
  };

  const handleCancel = () => {
    setShowDetail(false);
  };

  const renderOption = (options) => {
    return (
      <Menu>
        {options.map((item, index) => (
          <Menu.Item key={index} onClick={() => setSortBy(item.value)}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <Spin spinning={isLoading}>
      {showDetail && <ModalDetailApps name={id.current} handleCancel={handleCancel} />}
      <div className="detail-categories">
        <div className="detail-categories-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">Integration Capabilities</h1>
              <div className="title-apps">{total ? total.toLocaleString() : ''} Results</div>
            </div>
            <div className="sort">{renderFilterDropdown(renderOption(options), 'Sort By', sortBy)}</div>
          </div>
        </div>
      </div>
      <div className="container">
        <Row className="integrations">
          {data &&
            data.map((item) => (
              <Col className="integrations-card" key={item._id}>
                <Card
                  title={<div className="integrations-title">{item._id}</div>}
                  extra={<a onClick={() => onClickShow(item._id)}>View Apps</a>}
                >
                  <div className="flex items-center integrations-content">
                    <Image src="/image/integration.png" alt="" width={20} height={20} />
                    Number of applications: <span style={{ fontWeight: 500 }}>{item.count}</span>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
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
    </Spin>
  );
}
