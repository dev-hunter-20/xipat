'use client';

import { ArrowRightOutlined, LeftOutlined, RightOutlined, SearchOutlined, StarFilled } from '@ant-design/icons';
import {
  Button,
  Carousel,
  Col,
  Divider,
  Form,
  Input,
  Progress,
  Row,
  Spin,
  Tooltip,
  TreeSelect,
  Typography,
} from 'antd';
import './LandingPage.scss';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useRef, useState } from 'react';
import FadeInSection from './fade-in-section/FadeInSection';
import TableApp from './table-app/TableApp';
import Link from 'next/link';
import { COLUMNS } from '@/constants/MenuItem';
import Onboarding from './../onboarding/Onboarding';
import MainBlog from './blog/MainBlog';
import SecondaryBlog from './blog/SecondaryBlog';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import { sliders } from '@/utils/data/slider';
import Auth from '@/utils/store/Authentication';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useQuery } from '@tanstack/react-query';

dayjs.extend(relativeTime);

const LandingPage = () => {
  const router = useRouter();
  const [showOnboard, setShowOnboard] = useState(false);
  const [valueFilter, setValueFilter] = useState('finding-products');
  const features = useRef(null);
  const carouselRef = useRef(null);
  const [queryKey, setQueryKey] = useState(['filterByCat', valueFilter]);

  const onSearchApp = (values) => {
    const query = { keyword: values.appName };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/search?${queryString}`);
  };

  const handleSignUp = () => {
    if (Auth.getAccessToken()) {
      router.push('/pricing');
      return;
    }
    router.push('/auth/register');
  };

  const dataCategory = (allCategory) => {
    if (allCategory) {
      return allCategory.map((item) => {
        return {
          value: item.slug,
          title: item.text,
          children: dataCategory(item.child),
        };
      });
    }
  };

  const fetchDetailApp = async () => {
    const [top5Apps, dataCategoryPos, dataTopMover, dataTopReview, dataTopRelease, count, dataBlogs, isShowOnboard] =
      await Promise.all([
        LandingPageApiService.getTop5Apps('finding-products'),
        LandingPageApiService.getCategoriesHome('uk'),
        LandingPageApiService.getGrowthRateApps(1, 3),
        LandingPageApiService.getTopReviewHome(),
        LandingPageApiService.getTopReleaseHome(1, 9),
        LandingPageApiService.getCount(),
        LandingPageApiService.getBlog(1, 3),
        Auth.getAccessToken() && LandingPageApiService.handleShowOnboard(),
      ]);
    const categories = dataCategory(dataCategoryPos?.category);
    const topApp = {
      topMovers: dataTopMover?.data,
      topReviews: dataTopReview?.most_reviewed,
      topRelease: dataTopRelease?.top_release,
    };
    const blogs = dataBlogs?.data;
    const top5App = top5Apps?.data?.apps ? top5Apps.data.apps.sort((a, b) => a.star - b.star) : [];
    const showOnboard = isShowOnboard?.show_onboarding || false;
    return {
      categories,
      topApp,
      blogs,
      count,
      top5App,
      showOnboard,
    };
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fetchDetailApp'],
    queryFn: fetchDetailApp,
  });

  const filterByCat = async (id) => {
    const top5Apps = await LandingPageApiService.getTop5Apps(id);
    return top5Apps.data.apps.sort((a, b) => a.star - b.star);
  };

  const { data: top5Apps } = useQuery({
    queryKey: queryKey,
    queryFn: () => filterByCat(valueFilter),
    enabled: !!valueFilter,
  });

  const onChangeFilter = (value) => {
    setValueFilter(value);
    setQueryKey(['filterByCat', value]);
  };

  const slides = sliders.map((item) => {
    return (
      <div key={item.id} className="layout">
        <Row>
          <Col className="slide-img" lg={10} md={24}>
            <Image src={item.image} alt="trending" width={300} height={300} />
          </Col>
          <Col lg={12} md={24} style={{ padding: '20px' }}>
            <Row>
              <Typography.Text style={{ fontSize: '36px' }} className="title">
                {item.title}
              </Typography.Text>
            </Row>
            <Row>
              <Typography.Text style={{ fontSize: '16px' }} className="mt-20 description">
                {item.description}
              </Typography.Text>
            </Row>
            <Row>
              <Button icon={<ArrowRightOutlined />} className="wrapper__button" type="primary">
                Explore more
              </Button>
            </Row>
          </Col>
        </Row>
      </div>
    );
  });

  const renderDataSource = (data) => {
    if (data) {
      return data.map((item) => {
        return {
          key: item.detail.app_id,
          app: {
            img: item.detail.app_icon,
            name: item.detail.name || '--',
            desc: item.detail.metatitle || '--',
            slug: item.detail.app_id,
          },
          diffRank:
            item.count || item.review_count || (item.detail.launched ? dayjs(item.detail.launched).fromNow() : '--'),
        };
      });
    }
    return [];
  };

  const viewDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <div>{showOnboard && <Onboarding handleSuccess={() => setShowOnboard(data?.showOnboard)} />}</div>
      <div className="layout-landing-page">
        <div className="layout-landing-page-intro">
          <div className="container">
            <Row type="flex" style={{ alignItems: 'center' }}>
              <Col lg={12} span={24}>
                <h1 className="title">All you need to win Shopify Apps market</h1>
                <h2 className="description">Insights and data across thousands Shopify Apps</h2>
                <div className="input">
                  <Form onFinish={onSearchApp}>
                    <Form.Item name="appName">
                      <Input
                        className="input-style"
                        size="large"
                        placeholder="Find an app by name, categories and more"
                        prefix={<SearchOutlined />}
                      />
                    </Form.Item>
                  </Form>
                </div>
                <div className="divider">
                  <Divider />
                </div>
                <h2 className="description">Want a deeper insights?</h2>
                <div className="cta-btn">
                  <Button className="wrapper__button" onClick={handleSignUp}>
                    Start your free trial
                  </Button>
                </div>
              </Col>
              <Col lg={12} span={24} className="flex flex-col items-center">
                {top5Apps ? (
                  <div
                    className={`progress flex ${top5Apps ? 'flex-col justify-between' : 'justify-center items-center'}`}
                  >
                    {top5Apps ? (
                      top5Apps.map((item, index) => {
                        return (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <Progress
                              className={`progress-${index}`}
                              percent={60}
                              showInfo={false}
                              strokeColor={{
                                '0%': 'rgba(182, 131, 0, 1)',
                                '100%': 'rgba(255, 194, 37, 1)',
                              }}
                            />

                            <Tooltip title={item.name}>
                              <Typography.Text ellipsis={1} className="progress-name">
                                {item.name} <br /> {item.star} <StarFilled style={{ color: 'yellow' }} />
                              </Typography.Text>
                            </Tooltip>
                            <Link href={`/app/${item.id}`}>
                              <Image
                                className="progress-image"
                                src={item.app_icon}
                                alt="logoo"
                                width={48}
                                height={48}
                              />
                            </Link>
                          </div>
                        );
                      })
                    ) : (
                      <Spin size="large" />
                    )}
                  </div>
                ) : (
                  <div
                    className={`progress flex ${
                      data?.top5App ? 'flex-col justify-between' : 'justify-center items-center'
                    }`}
                  >
                    {data?.top5App ? (
                      data?.top5App.map((item, index) => {
                        return (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <Progress
                              className={`progress-${index}`}
                              percent={60}
                              showInfo={false}
                              strokeColor={{
                                '0%': 'rgba(182, 131, 0, 1)',
                                '100%': 'rgba(255, 194, 37, 1)',
                              }}
                            />

                            <Tooltip title={item.name}>
                              <Typography.Text ellipsis={1} className="progress-name">
                                {item.name} <br /> {item.star} <StarFilled style={{ color: 'yellow' }} />
                              </Typography.Text>
                            </Tooltip>
                            <a href={`/app/${item.id}`}>
                              <Image
                                className="progress-image"
                                src={item.app_icon}
                                alt="logoo"
                                width={48}
                                height={48}
                              />
                            </a>
                          </div>
                        );
                      })
                    ) : (
                      <Spin size="large" />
                    )}
                  </div>
                )}

                {data?.categories && (
                  <div className="sort-by">
                    <TreeSelect
                      showSearch
                      value={valueFilter}
                      placeholder="Please select"
                      onChange={onChangeFilter}
                      treeData={data?.categories}
                      virtual={false}
                      loading={isLoading}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </div>

        <FadeInSection>
          <div className="layout-landing-page-features" ref={features}>
            <div className="container">
              <Row justify={'center'}>
                <Col span={24} className="text-center">
                  <Typography.Title className="primary-color" level={3}>
                    Trending Statistics
                  </Typography.Title>
                </Col>
                <Col span={24} className="text-center">
                  <Typography.Text style={{ fontSize: '42px' }}>
                    Get Ahead of Your Competition with Our Trending Statistics
                  </Typography.Text>
                </Col>
                <Col span={24} className="slide">
                  <Row className="fetures-slide">
                    <Col span={1}>
                      <Button onClick={() => carouselRef.current.prev()} shape="circle" icon={<LeftOutlined />} />
                    </Col>
                    <Col span={22}>
                      <Carousel autoplay={true} dots={false} ref={carouselRef}>
                        {slides}
                      </Carousel>
                    </Col>
                    <Col span={1} className="btn-next">
                      <Button onClick={() => carouselRef.current.next()} shape="circle" icon={<RightOutlined />} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="layout-landing-page-collection">
            <div className="container">
              <Row justify="center">
                <Typography.Title className="primary-color" level={3}>
                  App Collection
                </Typography.Title>
              </Row>
              <Row justify="space-between">
                <Col className="bordered">
                  <TableApp
                    item={{
                      title: 'New Release',
                      data: renderDataSource(data?.topApp.topRelease),
                    }}
                  />
                </Col>
                <Col className="bordered-left">
                  {[
                    {
                      title: 'Top Movers',
                      data: renderDataSource(data?.topApp.topMovers),
                    },
                    {
                      title: 'Most Reviewed',
                      data: renderDataSource(data?.topApp.topReviews),
                    },
                  ].map((item, index) => (
                    <div key={index} className="bordered-left-styled">
                      <TableApp item={item} />
                    </div>
                  ))}
                </Col>
              </Row>
            </div>
          </div>
        </FadeInSection>

        <div className="layout-landing-page-param">
          <Row className="detail">
            <Col xl={8} lg={10} md={10} className="image">
              <Image src="/image/anhnen.png" alt="anhnen" className="image--padding" width={600} height={450} />
            </Col>
            <Col lg={12} sm={18} xs={22}>
              <FadeInSection>
                <Row>
                  <Typography.Title className="primary-color" level={3}>
                    Market Insights
                  </Typography.Title>
                </Row>
                <Row>
                  <Typography.Text style={{ fontSize: '42px' }}>Understand what rules the market</Typography.Text>
                </Row>
                <Row>
                  <Typography.Text className="detail__text">
                    Let’s Metrix helps marketers, developers and product managers to understand insights and data across
                    thousands Shopify Apps
                  </Typography.Text>
                </Row>
                {data?.count && (
                  <Row justify={'space-between'}>
                    {[
                      {
                        title: 'Apps',
                        value: data?.count.app_count,
                        href: '/dashboard',
                      },
                      {
                        title: 'Reviews',
                        value: data?.count.review_count,
                        href: '/dashboard/reviews',
                      },
                      {
                        title: 'Categories',
                        value: data?.count.category_count,
                        href: '/categories',
                      },
                      {
                        title: 'Developers',
                        value: data?.count.partner_count,
                        href: '/developers',
                      },
                    ].map((item, index) => (
                      <Col key={index} className="detail__box">
                        <Row>
                          <Link href={item.href}>
                            <Typography.Text className="total-title" level={1}>
                              {item?.value?.toLocaleString('en-US') ?? ''}
                            </Typography.Text>
                          </Link>
                        </Row>
                        <Row>
                          <Typography.Text className="total-desc">{item.title}</Typography.Text>
                        </Row>
                      </Col>
                    ))}
                  </Row>
                )}
                <Row>
                  <Button onClick={viewDashboard} className="wrapper__button mt-30" type="primary">
                    Explore what you can get
                  </Button>
                </Row>
              </FadeInSection>
            </Col>
          </Row>
        </div>

        <FadeInSection>
          <div className="layout-landing-page-blog">
            <div className="container">
              <Row justify={'center'}>
                <Col span={24}>
                  <Row>
                    <Typography.Title className="primary-color" level={3}>
                      Blog
                    </Typography.Title>
                  </Row>
                  <Row>
                    <Typography.Text style={{ fontSize: '42px' }}>Insights and Inspiration</Typography.Text>
                  </Row>
                  <Row gutter={60} style={{ marginTop: '30px' }}>
                    {data?.blogs && (
                      <>
                        <MainBlog slug={data?.blogs[0].slug} />
                        <Col lg={13} md={24} className="blog-column">
                          {[data?.blogs[1].slug, data?.blogs[2].slug].map((item, index) => (
                            <SecondaryBlog key={index} slug={item} />
                          ))}
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="layout-landing-page-download">
            <div className="container">
              <Row justify={'center'}>
                <Row style={{ height: '100%' }}>
                  <Col xl={12} lg={24} className="mt-30">
                    <Row>
                      <Typography.Text className="download-title">Ready to win your App Market?</Typography.Text>
                    </Row>
                    <Row>
                      <Button className="button-getKey">Get your key to success</Button>
                    </Row>
                  </Col>
                  <Col xl={12} className="download-cols">
                    <Row align="bottom" justify="center" style={{ height: '100%' }}>
                      {COLUMNS.map((item, index) => (
                        <Col
                          key={index}
                          className="cols"
                          style={{
                            height: item.height,
                            background: item.color,
                          }}
                        />
                      ))}
                    </Row>
                  </Col>
                </Row>
              </Row>
            </div>
          </div>
        </FadeInSection>
      </div>
    </>
  );
};

export default LandingPage;
