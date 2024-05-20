import React, { memo, useEffect } from 'react';
import { Button, Drawer, Form, Input, InputNumber, Radio, Space } from 'antd';
import { BasicStatus } from '#/enum.ts';
export type PostDrawerProps = {
  formValue: any;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  treeData?: any;
  [key: string]: any;
};
const DictTypeDrawer = ({ title, show, formValue, onOk, onCancel }): React.JSX.Element => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);
  return (
    <>
      <Drawer
        destroyOnClose
        width={750}
        title={title}
        open={show}
        onClose={onCancel}
        footer={
          <Space>
            <Button
              type={'primary'}
              onClick={() => {
                form
                  .validateFields()
                  .then((formData) => {
                    onOk(title, { ...formValue, ...formData });
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }}
            >
              确定
            </Button>
            <Button type={'text'} onClick={onCancel}>
              取消
            </Button>
          </Space>
        }
      >
        <Form
          initialValues={formValue}
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
        >
          <Form.Item
            label="名称"
            name="dictName"
            rules={[{ required: true, message: '名称不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="key"
            name="dictType"
            rules={[{ required: true, message: 'key不能为空' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '状态不能为空' }]}
          >
            <Radio.Group optionType="default" buttonStyle="solid">
              <Radio value={Number(BasicStatus.ENABLE)}>启用</Radio>
              <Radio value={Number(BasicStatus.DISABLE)}>禁用</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default DictTypeDrawer;
