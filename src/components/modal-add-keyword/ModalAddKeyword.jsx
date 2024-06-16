'use client';

import { Button, Form, Modal, Select, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';

export default function ModalAddKeyword(props) {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [dataSelect, setDataSelect] = useState([]);

  const handleOk = () => {
    props.handleEditOk();
  };

  const fetchSuggestKeyword = async (id) => {
    const result = await DetailAppApiService.getSuggestKeyword(id);
    if (result && result.code == 0) {
      setData(result.keywords.filter((item) => !props.keywordExist.map((key) => key.keyword.keyword).includes(item)));
    }
  };

  useEffect(() => {
    fetchSuggestKeyword(props.id);
  }, []);

  const addKeyword = (key) => {
    const fieldValue = form.getFieldValue('keyName');
    form.setFieldsValue({
      keyName: fieldValue ? [...fieldValue, key] : [key],
    });
    setDataSelect((prev) => [...prev, key]);
  };

  const onChange = (values) => {
    setDataSelect(values);
  };

  const checkAction = (dataSelect, item) => {
    if (dataSelect.includes(item)) {
      return;
    }
    if (dataSelect.length >= 5) {
      message.error('Cannot add more than 5 keywords');
      return;
    }
    addKeyword(item);
  };

  return (
    <Modal width={550} title="Add Keyword" footer={null} visible={true} onOk={handleOk} onCancel={handleOk}>
      <div className="popup-edit-keyword">
        <div className="input-keyword">
          <Form form={form} layout="vertical" className="form-edit" onFinish={props.saveKeyword}>
            <Form.Item
              label="Keywords"
              name="keyName"
              required
              rules={[
                {
                  required: true,
                  message: 'Please enter keywords',
                },
                () => ({
                  validator(_, value) {
                    if (value.some((element) => element.trim() === '')) {
                      return Promise.reject(new Error('Keywords is invalid'));
                    }
                    if (value.length <= 5) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Cannot add more than 5 keywords'));
                  },
                }),
              ]}
            >
              <Select
                mode="tags"
                style={{
                  width: '100%',
                }}
                notFoundContent={null}
                open={false}
                onChange={onChange}
              />
            </Form.Item>
            {data && data.length > 0 && (
              <Form.Item className="suggest-keyword">
                <div className="suggest-keyword-note">* List of keywords related obtained from AI bot</div>
                <>
                  {data.map((item, index) => (
                    <Tag
                      key={index}
                      onClick={() => checkAction(dataSelect, item)}
                      className="suggest-keyword-tag"
                      color={dataSelect.includes(item) ? 'blue' : 'default'}
                      style={{
                        cursor: dataSelect.includes(item) ? 'default' : 'pointer',
                      }}
                    >
                      {item} {dataSelect.includes(item) ? <></> : <PlusOutlined />}
                    </Tag>
                  ))}
                </>
              </Form.Item>
            )}
            <Form.Item>
              <Button htmlType="submit" className="button-edit" type="primary" style={{ width: '100%' }}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
