/* eslint-disable @next/next/no-img-element */
'use client';
import { Avatar, Button, Dropdown, Empty, Input, Layout, Menu, Tooltip } from 'antd';
import { CaretDownOutlined, CloseOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MENU_APP_ITEM, MENU_ITEMS, MENU_TOP_APP_ITEM } from './../../constants/MenuItem';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import Auth from '@/utils/store/Authentication';
import { getNoti, getReviewChanges } from '@/utils/functions';
import SearchDataApiService from '@/api-services/api/SearchDataApiService';
import WatchAppChangeApiService from '@/api-services/api/WatchAppChangeApiService';
import './HeaderComponent.scss';

const { Header } = Layout;

const HeaderComponent = ({ myApps, menu, isShowProfile, selectedKeys, setSelectedKey }) => {
  const [listSearch, setListSearch] = useState();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const router = useRouter();
  const userName = Auth.getCurrentUser();

  const onClickHomepage = () => {
    setSelectedKey(null);
  };

  const topAppsSubmenu = (
    <Menu className="apps-dropdown">
      {MENU_TOP_APP_ITEM.map((item) => (
        <Menu.Item key={item.key}>
          <Link href={item.linkTo}>{item.title}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  const popupSubmenu = (
    <Menu className="apps-dropdown">
      {MENU_APP_ITEM.map((item) => (
        <Menu.Item key={item.key}>
          <Link href={item.linkTo}>{item.title}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleMenuItemClick = (e) => {
    e.domEvent.stopPropagation();
  };

  const viewDetailApp = (id) => {
    router.push(`/app/${id}`);
  };

  const listAppsSearch = useMemo(() => {
    return listSearch ? (
      listSearch.length > 0 ? (
        <Menu>
          {listSearch.map((item) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <Link href={`/app/${item.value}`} onClick={() => viewDetailApp(item.value)}>
                <Menu.Item key={item.value}>
                  <div>
                    {item.icon && (
                      <Image
                        style={{ margin: '2px 5px 5px 0', borderRadius: '4px' }}
                        src={item.icon}
                        alt="icon"
                        width={30}
                        height={30}
                      />
                    )}
                    {item.text}
                  </div>
                </Menu.Item>
              </Link>
            );
          })}
        </Menu>
      ) : (
        <Menu>
          <Menu.Item>
            <i style={{ padding: '10px' }}>No Result</i>
          </Menu.Item>
        </Menu>
      )
    ) : (
      <></>
    );
  }, [listSearch]);

  const debouncedHandleInputChange = debounce(async (value) => {
    try {
      setLoadingSearch(true);
      const result = await SearchDataApiService.searchData(value, 1, 12);
      setLoadingSearch(false);
      if (result && result.code === 0) {
        setListSearch(
          result.data.apps.map((item) => {
            return {
              value: item.app_id,
              text: item.detail.name,
              icon: item.detail.app_icon,
            };
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, 500);

  const onSearchApps = async (current) => {
    debouncedHandleInputChange(current.target.value);
  };

  const handleLogin = () => {
    router.push('/auth/login-app');
    router.refresh();
  };

  const renderBgColor = (app) => {
    if (app.delete || app.unlisted) {
      return '#ffcccc';
    }
    return '';
  };

  const watchAppChange = async (id) => {
    await WatchAppChangeApiService.watchAppChange(id);
    router.push(`/app/${id}`);
    if (window.location.pathname.includes('/app')) {
      router.refresh();
    }
  };

  const popupMyApp = (
    <div className="scrollable-menu">
      {myApps && myApps.length > 0 ? (
        <Menu className="apps-dropdown">
          {myApps.map((item) => {
            return (
              <Menu.Item
                key={item.app_id}
                onClick={() => watchAppChange(item.app_id)}
                style={{ backgroundColor: renderBgColor(item.detail) }}
              >
                <Image
                  style={{ margin: '2px 5px 5px 0', borderRadius: '4px' }}
                  src={item.detail.app_icon}
                  alt=""
                  width={30}
                  height={30}
                />
                {item.detail.name}
                {Object.keys(item.changed).length > 0 && item.changed.review_count && !item.watched_changes && (
                  <span className="review-change">
                    {getReviewChanges(item.changed.review_count.after, item.changed.review_count.before)}
                  </span>
                )}
                {getNoti(item)}
              </Menu.Item>
            );
          })}
        </Menu>
      ) : (
        <Menu className="apps-dropdown">
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            imageStyle={{
              height: 60,
            }}
            description={
              <span style={{ fontSize: '15px' }}>
                <Link href="/explore">Search</Link> for applications that interest you
              </span>
            }
          />
        </Menu>
      )}
    </div>
  );

  return (
    <Header className="sasi-layout-background">
      <div className="header-sasi container">
        <div className="menu-sasi">
          <div className="menu-content">
            <div className="logo-sasi">
              <Menu>
                <Menu.Item key="homepage" onClick={onClickHomepage}>
                  <Image src="/image/logo_update.png" className="img-responsive" alt="Logo" width={75} height={45} />
                  <Link href={'/'} />
                </Menu.Item>
              </Menu>
            </div>
            <div className="menu-right">
              <div className="list-menu">
                <Menu mode="horizontal" defaultSelectedKeys={['4']} selectedKeys={[selectedKeys]}>
                  {MENU_ITEMS.map((item) => {
                    if (item.hasSub) {
                      return (
                        <Menu.Item key={item.key} className="menu-item-detail">
                          <Dropdown
                            placement="bottom"
                            overlay={item.key === 'topApps' ? topAppsSubmenu : popupSubmenu}
                            className="box-shadow"
                            arrow
                          >
                            <Link href={item.linkTo} className="menu-link">
                              {item.title}
                              <CaretDownOutlined style={{ marginLeft: '5px' }} />
                            </Link>
                          </Dropdown>
                        </Menu.Item>
                      );
                    }
                    {
                      if (item.isCheckAuth) {
                        if (Auth.isAuthenticated() && item.isShowPopupMyApp) {
                          return (
                            <Menu.Item key="my-apps" className="menu-item-detail">
                              <Dropdown placement="bottom" overlay={popupMyApp} arrow>
                                <span className="menu-link">{item.title}</span>
                              </Dropdown>
                            </Menu.Item>
                          );
                        }
                      } else {
                        return (
                          <Menu.Item key={item.key} className="menu-item-detail">
                            <Link href={item.linkTo} className="menu-link">
                              {item.title}
                            </Link>
                          </Menu.Item>
                        );
                      }
                    }
                  })}
                  <Menu.Item key="search" onClick={handleMenuItemClick} className="menu-item-search">
                    {isShowSearch ? (
                      <Dropdown overlay={listAppsSearch} trigger={['click']}>
                        <Input
                          placeholder="Application name"
                          className="search-data"
                          onChange={onSearchApps}
                          onClick={(e) => e.stopPropagation()}
                          suffix={loadingSearch ? <LoadingOutlined /> : <></>}
                        />
                      </Dropdown>
                    ) : (
                      <>
                        <SearchOutlined
                          className="search-icon"
                          onClick={(e) => {
                            setIsShowSearch(true);
                            e.stopPropagation();
                          }}
                        />
                        <div
                          className="search-text"
                          onClick={(e) => {
                            setIsShowSearch(true);
                            e.stopPropagation();
                          }}
                        >
                          Search
                        </div>
                      </>
                    )}
                    {isShowSearch && <CloseOutlined className="close-icon" onClick={() => setIsShowSearch(false)} />}
                  </Menu.Item>
                </Menu>
              </div>
            </div>
          </div>
          {isShowProfile ? (
            <div className="header-profile flex items-center">
              <Dropdown overlay={menu} trigger={['click']}>
                <Tooltip title={userName ? userName : ''} className="flex items-center" placement="right">
                  <Avatar className="avatar-profile-header" style={{ backgroundColor: '#FFC225' }}>
                    {userName ? userName.substring(0, 1).toLocaleUpperCase() : ''}
                  </Avatar>
                </Tooltip>
              </Dropdown>
              <div className="model-connect-shopify"></div>
            </div>
          ) : (
            <div className="button-login">
              <Button className="button-login-styled" size={'medium'} onClick={handleLogin}>
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;
