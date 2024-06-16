'use client';

import { useState, useEffect } from "react";
import { Col, Row, Spin, Breadcrumb } from "antd";
import { usePathname } from 'next/navigation';
import "./BlogDetail.scss";
import BlogsApiService from "@/api-services/api/BlogsApiService";

function BlogDetail() {
  const [blogDetail, setBlogDetail] = useState({
    title: "",
    date: "",
    content: "",
    author: "",
    imgUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const parts = pathname.split('/');
  const lastPart = parts[parts.length - 1];
  const slug = lastPart;

  useEffect(() => {
    fetchBlogDetail(slug);
  }, []);

  async function fetchBlogDetail(slug) {
    setIsLoading(true);
    let blog = await BlogsApiService.getBlogDetail(slug);
    if (blog) {
      setBlogDetail({
        title: blog.data.title,
        date: blog.data.created_at,
        content: blog.data.content,
        author: blog.data.author,
        imgUrl: blog.data.img,
      });
      setIsLoading(false);
    }
  }
  const customDiv = (html) => (
    <div dangerouslySetInnerHTML={{ __html: html }}></div>
  );
  const myDate = new Date(blogDetail.date);

  return (
    <Spin spinning={isLoading}>
      <div className='breadcrumb-header'>
        <div className='container'>
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href={`/`}>Home</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href='/blogs'>Blogs</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ color: "white" }}>
              {blogDetail.title}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className='container-blog'>
        <Row type='flex' style={{ alignItems: "center", marginTop: "20px" }}>
          <Col lg={24} span={24}>
            <h1>{blogDetail.title}</h1>
            <div className='blog-meta'>
              <i>Author:</i> <strong>{blogDetail.author}</strong> |{" "}
              <i>Created Date:</i> {myDate.toLocaleDateString("en-GB")}
            </div>
            <div className='blog-content'>
              {customDiv(blogDetail.content)}
            </div>
          </Col>
        </Row>
      </div>
    </Spin>
  );
}
export default BlogDetail;
