import { Button, Drawer, Form, Input, InputNumber, Radio, Select, Space, TreeSelect } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { useUserPermission } from '@/store/userStore';

import { Permission } from '#/entity';
import { BasicStatus, PermissionType } from '#/enum';

export type PostDrawerProps = {
  formValue: Permission;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  treeData?: any;
  [key: string]: any;
};

export default function SysApiDrawer({
  title,
  show,
  formValue,
  treeData,
  onOk,
  onCancel,
}: PostDrawerProps) {
  const [form] = Form.useForm();
  const permissions = useUserPermission();
  // const [setCompOptions] = useState(pagesSelect);

  const getParentNameById = useCallback(
    (parentId: string, data: Permission[] | undefined = permissions) => {
      let name = '';
      if (!data || !parentId) return name;
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].id === parentId) {
          name = data[i].name;
        } else if (data[i].children) {
          name = getParentNameById(parentId, data[i].children);
        }
        if (name) {
          break;
        }
      }
      return name;
    },
    [permissions],
  );

  // const updateCompOptions = (name: string) => {
  //   setCompOptions(
  //     pagesSelect.filter((path) => {
  //       return path.value.includes(name.toLowerCase());
  //     }),
  //   );
  // };

  useEffect(() => {
    form.setFieldsValue({ ...formValue });
    // if (formValue.parentId) {
    //   const parentName = getParentNameById(formValue.parentId);
    //   updateCompOptions(parentName);
    // }
  }, [formValue, form, getParentNameById]);

  return (
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
                  onOk({ ...formData, id: formValue.id });
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
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '名称不能为空' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="接口类型"
          name="type"
          rules={[{ required: true, message: '接口类型不能为空' }]}
        >
          <Select
            options={[
              { label: 'BUS', value: 'BUS' },
              { label: 'SYS', value: 'SYS' },
            ]}
          />
        </Form.Item>
        <Form.Item label="名称" name="handle">
          <Input.TextArea disabled />
        </Form.Item>
        <Form.Item label="接口地址" name="path">
          <Input disabled />
        </Form.Item>
        <Form.Item label="请求方式" name="method">
          <Input disabled />
        </Form.Item>
        <Form.Item label="历史" name="isHistory">
          <Select
            disabled
            options={[
              { label: '正常', value: 0 },
              { label: '历史', value: 1 },
            ]}
          />
        </Form.Item>
        <Form.Item label="项目" name="postCode">
          <Input disabled />
        </Form.Item>
        <Form.Item label="业务" name="bus">
          <Input disabled />
        </Form.Item>
        <Form.Item label="func" name="func">
          <Input disabled />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
