'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { message } from 'antd';
import { getParameterQuery } from '@/utils/functions';
import { StarFilled } from '@ant-design/icons';
import ModalListApp from './ModalListApp';
import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';

function DeveloperByDay() {
  const params = getParameterQuery();
  const date = params.date;
  const [loading, setLoading] = useState(false);
  const [listDevelopers, setListDevelopers] = useState([]);
  const page = useRef(1);
  const perPage = 20;
  const [showApps, setShowApps] = useState(false);

  const idDeveloper = useRef();

  const asyncFetch = async (page, per_page, date) => {
    setLoading(true);
    const result = await DashboardDeveloperApiService.getDeveloperByDate(page, per_page, date);
    setLoading(false);
    if (result && result.code == 0) {
      setListDevelopers(result.result);
      return;
    }
    message.error(result.message);
  };

  useEffect(() => {
    asyncFetch(page.current, perPage, date);
  }, []);

  const handleCancel = () => {
    setShowApps(false);
  };

  return (
    <Spin spinning={loading}>
      <div className="detail-categories ">
        {showApps && <ModalListApp id={idDeveloper.current} handleCancel={handleCancel} />}
        <div className="detail-categories-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">{date}</h1>
              <div className="title-apps">{listDevelopers ? listDevelopers.length : '0'} Developers</div>
            </div>
          </div>
          <div className="line-top"></div>
          <div className="detail-category">
            <div className="title-column">
              <Row>
                <Col className="title-styled" span={5}>
                  Name
                </Col>
                <Col className="title-styled" span={5}>
                  Applications
                </Col>
                <Col className="title-styled" span={4}>
                  Date
                </Col>
                <Col className="title-styled" span={5}>
                  Reviews
                </Col>
                <Col className="title-styled" span={5}>
                  Avg Rating
                </Col>
              </Row>
            </div>
            {listDevelopers
              ? listDevelopers.map((itemChild, index) => {
                  return (
                    <div
                      className="item-detail"
                      key={'' + index}
                      style={{
                        backgroundColor: '#fff',
                      }}
                    >
                      <Row>
                        <Col span={5}>
                          <a href={`/developer/${itemChild._id}`}>{itemChild.name}</a>
                        </Col>
                        <Col span={5}>
                          <a
                            onClick={() => {
                              setShowApps(true);
                              idDeveloper.current = itemChild._id;
                            }}
                          >
                            {`${itemChild.count_app}${itemChild.count_app > 1 ? ' apps' : ' app'}`}
                          </a>
                        </Col>
                        <Col span={4}>
                          <div>{itemChild.date}</div>
                        </Col>
                        <Col span={5}>
                          <div>{itemChild.review_count || '-'}</div>
                        </Col>
                        <Col span={5}>
                          <div className="icon-star">
                            {itemChild.avg_star ? itemChild.avg_star : '-'}
                            {itemChild.avg_star ? (
                              <span>
                                <StarFilled
                                  style={{
                                    marginLeft: '3px',
                                    color: '#ffc225',
                                  }}
                                />
                              </span>
                            ) : (
                              ''
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  );
                })
              : ''}
          </div>
        </div>
      </div>
    </Spin>
  );
}
export default DeveloperByDay;
