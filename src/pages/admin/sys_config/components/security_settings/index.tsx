import React from 'react';
import { Button, Form, Input } from 'antd';

const Index = () => {
  return (
    <div>
      <Form>
        <Form.Item label={'初始化密码'} tooltip={'用户注冊时默认的密码。'}>
          <Input.Password />
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
