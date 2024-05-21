import React from 'react';
import { Alert, Button, Form, Input } from 'antd';

const Index = () => {
  return (
    <div>
      <Form>
        <Form.Item label={'通知类型'}>
          <Input />
        </Form.Item>
        <Form.Item label={'webhook'}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Alert
            description="如何创建企业微信群机器人，请访问：https://developer.work.weixin.qq.com/tutorial/robot/2"
            type="info"
            showIcon
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType={'submit'} type={'primary'}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Index;
