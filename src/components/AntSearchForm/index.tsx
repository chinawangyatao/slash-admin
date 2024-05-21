import {
  Button,
  Card,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  TimePicker,
  TreeSelect,
} from 'antd';
import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';

const Index = ({ FormColumns, formOptions }) => {
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);
  return (
    <div className={'py-3'}>
      <Card>
        <Form labelCol={formOptions.labelCol}>
          <Row>
            {FormColumns.map((item, index) => (
              <Col key={item.key}>
                <Form.Item label={item.label} rules={item.rules}>
                  <FormItemsElement type={item.type} options={item.options} />
                </Form.Item>
              </Col>
            ))}
          </Row>
          <div>
            <Space>
              <Button type={'primary'} htmlType={'submit'}>
                提交
              </Button>{' '}
              <Button type={'primary'} htmlType={'reset'}>
                重置
              </Button>
              <Button
                className={'duration-300'}
                icon={<DownOutlined rotate={expand ? 180 : 0} />}
                onClick={() => setExpand(!expand)}
              >
                展开
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Index;

export const FormItemsElement = (props) => {
  switch (props.type) {
    case 'Cascader':
      return <Cascader {...props.options}></Cascader>;
    case 'Checkbox':
      return <Checkbox {...props.options}></Checkbox>;
    case 'CheckboxGroup':
      return <Checkbox.Group {...props.options} />;
    case 'DatePicker':
      return <DatePicker {...props.options} />;
    case 'Input':
      return <Input {...props.options} />;
    case 'InputNumber':
      return <InputNumber {...props.options} />;
    case 'Radio':
      return <Radio {...props.options} />;
    case 'Select':
      return <Select {...props.options} />;
    case 'Switch':
      return <Switch {...props.options} />;
    case 'TimePicker':
      return <TimePicker {...props.options} />;
    case 'TreeSelect':
      return <TreeSelect {...props.options} />;

    default:
      return null;
  }
};
