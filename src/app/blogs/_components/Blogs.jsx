'use client';

import React from "react";
import BlogItems from "./BlogItems";
import "./Blogs.scss";
import { useState, useEffect } from "react";
import { message, Spin, Row, Col, Typography } from "antd";
import BlogsApiService from "@/api-services/api/BlogsApiService";

const ListBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoaded, setisLoaded] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setisLoaded(true);
      let result = await BlogsApiService.getAllBlogs();
      setisLoaded(false);

      if (result && result.code == 0) {
        setBlogs(result.data);
      }
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <Spin spinning={isLoaded}>
      <div className='container flex justify-center'>
        <div className='container-blogs'>
          <Row style={{ marginBottom: "30px" }}>
            <Col span={24} className='text-center'>
              <Typography.Title level={1} className='primary-color'>
                Insights and Inspiration
              </Typography.Title>
            </Col>
            <Col span={24} className='text-center'>
              <Typography.Text style={{ fontSize: "38px" }}>
                Get Ahead of Your Competition with Our Trending Statistics
              </Typography.Text>
            </Col>
          </Row>
          <Row gutter={[30, 30]}>
            {blogs.map((blog) => (
              <BlogItems key={blog.slug} blog={blog} fetchBlogs={fetchBlogs} />
            ))}
          </Row>
        </div>
        <div className='widget-area'></div>
      </div>
    </Spin>
  );
};

export default ListBlogs;
