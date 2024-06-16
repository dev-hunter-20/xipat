import { Col, Row } from 'antd';
import { forEach } from 'lodash';
import { BlogSite, CategorySite, CollectionSite, DeveloperSite } from '@/utils/data/DataCrawl';
import Link from 'next/link';
import NavbarPage from '@/layouts/main/NavbarPage';
import './Sitemap.scss';

const Sitemap = () => {
  const renderedListAll = (isDeveloper, categories, dataCategories = [], margin = 0, size = 0, fontWeight = 0) => {
    let data = dataCategories;
    margin = margin + 20;
    size = size + 16;
    fontWeight = fontWeight + 500;
    forEach(categories, (item, index) => {
      data.push(
        <div style={{ marginLeft: margin, fontSize: size }} className="list-item-categories" key={'' + index}>
          <div className="item-categories-detail">
            <div className="item-name">
              <Link
                style={{ fontWeight: fontWeight }}
                href={isDeveloper ? `/app/${item.slug}` : '/category/' + item.slug}
              >
                {item.text}
              </Link>
            </div>
          </div>
        </div>,
      );
      if (item.child && item.child.length) {
        renderedListAll(false, item.child, data, margin, size - 18, fontWeight - 600);
      }
    });
    return data;
  };

  return (
    <NavbarPage>
      <div className="sitemap container">
        <div className="header-category">Categories</div>
        <Row gutter={10}>
          {CategorySite.map((item) => (
            <Col md={8} sm={12} xs={24} className="category-name" key={item.slug}>
              <Link style={{ fontWeight: 600 }} href={`/category/${item.slug}`}>
                {item.text}
              </Link>
              {renderedListAll(false, item.child)}
            </Col>
          ))}
        </Row>
        <div className="header-category">Collections</div>
        <Row gutter={20}>
          {CollectionSite.map((item) => (
            <Col md={8} sm={12} xs={24} className="collection-name" key={item.slug}>
              <Link href={`/collection/${item.slug}`}>{item.text}</Link>
            </Col>
          ))}
        </Row>
        <div className="header-category">Blogs</div>
        <Row>
          {BlogSite.map((item) => (
            <Col md={8} sm={12} xs={24} className="collection-name" key={item.slug}>
              <Link href={`/blogs/${item.slug}`}>{item.title}</Link>
            </Col>
          ))}
        </Row>
        <div className="header-category">Developers</div>
        <Row>
          {DeveloperSite.sort((a, b) => b.apps.length - a.apps.length).map((item) => (
            <Col md={8} sm={12} xs={24} className="category-name" key={item.id}>
              <Link style={{ fontWeight: 600 }} href={`/developer/${item.id}`}>
                {item.name}
              </Link>
              {renderedListAll(
                true,
                item.apps.map((app) => ({
                  slug: app.app_id,
                  text: app.app_name,
                })),
                [],
                0,
                -1,
                -100,
              )}
            </Col>
          ))}
        </Row>
      </div>
    </NavbarPage>
  );
};

export default Sitemap;
