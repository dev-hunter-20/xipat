import { Card, Col, Tag } from 'antd';
import './BlogItems.scss';
import Image from 'next/image';
import Link from 'next/link';

const { Meta } = Card;

function BlogItems(props) {
  const blog = props.blog;

  const renderTitle = (author, title, date, slug) => {
    return (
      <div className="item-title">
        <div className="item-title-author">
          Author: {author} / {date}
        </div>
        <Link href={`/blogs/${slug}`} className="item-title-link">
          <div className="item-title-content">{title}</div>
        </Link>
      </div>
    );
  };

  const renderDescription = (desc, tags) => {
    return (
      <div className="item-desc">
        <div className="item-desc-content">{desc}</div>
        <div className="item-desc-tag">
          {tags.map((item, index) => (
            <Tag key={index}>{item}</Tag>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Col xs={24} lg={6} md={8} sm={12}>
      <Card cover={<Image alt="example" src={blog.img} height={200} width={100} />}>
        <Meta
          title={renderTitle(blog.author, blog.title, blog.created_at, blog.slug)}
          description={renderDescription(blog.decs, blog.tags)}
        />
      </Card>
    </Col>
  );
}

export default BlogItems;
