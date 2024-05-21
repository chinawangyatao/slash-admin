import React from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select, Switch } from 'antd';

const Index = () => {
  return (
    <div>
      <Form labelCol={{ span: 7 }}>
        <Row>
          <Col span={12}>
            <Form.Item label={'云存储'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'上传方式'}>
              <Switch checkedChildren={'临时授杈'} unCheckedChildren={'ak/sk'} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'AK'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'SK'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'⻆⾊ARN'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'RAM⻆⾊名称'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'持续时间(单位:秒)'}>
              <InputNumber />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'地区'}>
              <Select />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'桶'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'启用对象存储'}>
              <Switch checkedChildren={'启用'} unCheckedChildren={'禁用'} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button htmlType={'submit'} type={'primary'}>
                提交
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Index;
