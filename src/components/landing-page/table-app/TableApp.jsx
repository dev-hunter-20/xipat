'use client';
import { Button, Col, Row, Table, Tag, Typography } from 'antd';
import { RiseOutlined } from '@ant-design/icons';
import './TableApp.scss';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const TableApp = (props) => {
  const router = useRouter();

  const viewDetailApp = (slug) => {
    router.push(`app/${slug}`);
    router.refresh();
  };

  const renderColumn = (type) => {
    if (props.isReview) {
      return 'Reviews';
    }
    if (props.isDashboard) {
      return 'Date';
    }
    return type === 'New Release' ? 'Published Date' : 'Ranking';
  };
  const columns = (type) => {
    return [
      {
        title: (
          <Typography.Title level={3} style={{ margin: 0, fontSize: '16px' }}>
            App name
          </Typography.Title>
        ),
        dataIndex: 'app',
        render: (item) => (
          <Row align={'middle'} gutter={20}>
            <Col span={4} className="app-icon">
              <Image src={item.img} alt="app_icon" width={60} height={60} />
            </Col>
            <Col span={8}>
              <Typography.Title
                level={3}
                className="app-name"
                ellipsis={{ rows: 2, tooltip: item.name }}
                onClick={() => viewDetailApp(item.slug)}
              >
                {item.name}
              </Typography.Title>
            </Col>
            <Col span={12}>
              <div className="app-desc">{item.desc}</div>
            </Col>
          </Row>
        ),
      },
      {
        title: (
          <Typography.Title level={3} style={{ margin: 0, fontSize: '16px' }}>
            {renderColumn(type)}
          </Typography.Title>
        ),
        dataIndex: 'diffRank',
        render: (item) => (
          <>
            {typeof item === 'number' ? (
              <Tag
                style={{
                  borderRadius: '16px',
                  color: '#336B1F',
                  fontSize: '14px',
                  padding: '5px 10px',
                  fontWeight: 500,
                }}
                color="rgba(101, 216, 60, 0.36)"
              >
                <Typography.Text>{item}</Typography.Text>
                <RiseOutlined />
              </Tag>
            ) : (
              <> {item} </>
            )}
          </>
        ),
        width: type === 'New Release' || props.isDashboard || props.isReview ? 150 : 100,
      },
    ];
  };
  return (
    <div className="table-app">
      {!props.isDashboard && !props.isReview && (
        <Row>
          <Typography.Title level={2} className="title">
            {props.item.title}
          </Typography.Title>
        </Row>
      )}
      <Row>
        <Table
          style={{ width: '100%' }}
          columns={columns(props.item.title)}
          dataSource={props.item.data}
          pagination={false}
          loading={props.loading}
          scroll={props.isDashboard || props.isReview ? { y: 400 } : {}}
        />
      </Row>
      {!props.isDashboard && !props.isReview && (
        <Row justify={'center'}>
          <Button className="wrapper__button">
            <a
              href={`${
                props.item.title === 'Top Movers'
                  ? '/growth_rate'
                  : props.item.title === 'Most Reviewed'
                  ? '/top-reviewed'
                  : '/top-new-apps'
              }`}
            >
              See more apps
            </a>
          </Button>
        </Row>
      )}
    </div>
  );
};

export default TableApp;
