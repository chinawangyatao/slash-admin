import React from 'react';
import { Col, Form, Input, Row } from 'antd';

const Index = () => {
  return (
    <div>
      <Form labelCol={{ span: 4 }}>
        <Row>
          <Col span={12}>
            <Form.Item label={'app名称'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'站点标志'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'站点徽标'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'用户头像'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'站点描述'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'边栏样式'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'皮肤样式'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'应用说明'}>
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Index;
