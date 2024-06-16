'use client';

import { Breadcrumb, Layout } from 'antd';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ModalConnectShopify from '@/components/ui/modal/ModalConnectShopify';
import { BREADCRUMB_ROUTES } from '@/constants/MenuItem';
import ScrollToTop from '@/components/ui/scroll-to-top/ScrollToTop';
import './Container.scss';

const { Content } = Layout;

const Container = ({ children, isShowConnectShopify, setIsShowConnectShopify }) => {
  const pathname = usePathname();

  const disableModalConnectShopifyApi = () => {
    setIsShowConnectShopify(false);
  };

  const getLabelBreadcrumb = () => {
    const currentPage = BREADCRUMB_ROUTES.find((item) => item.path == pathname);
    return currentPage ? currentPage.label : '';
  };

  const breadcrumbItems = [
    {
      title: <Link href={`/`}>Home</Link>,
      key: 'home',
    },
    {
      title: getLabelBreadcrumb(),
      key: 'current',
    },
  ];

  return (
    <Content className="container-content">
      {isShowConnectShopify && (
        <div className="modal-connect-shopify">
          <ModalConnectShopify disableModal={disableModalConnectShopifyApi} />
        </div>
      )}
      {BREADCRUMB_ROUTES.map((item) => item.path).includes(pathname) && (
        <div className="breadcrumb-header">
          <div className="container">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
      )}

      <div
        className="content-menu"
        style={{
          marginBottom: `${pathname === '/' || pathname === '/explore' ? 0 : '50px'}`,
        }}
      >
        {children}
      </div>
      <ScrollToTop />
    </Content>
  );
};

export default Container;
