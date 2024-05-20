import { Button, Drawer, Form, Input, InputNumber, Radio, Space, TreeSelect } from 'antd';
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

export default function PostDrawer({
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
                  onOk(title, { ...formData, postId: formValue.postId });
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
          name="postName"
          rules={[{ required: true, message: '名称不能为空' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="代码"
          name="postCode"
          rules={[{ required: true, message: '代码不能为空' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="状态" name="status" rules={[{ required: true, message: '状态不能为空' }]}>
          <Radio.Group optionType="default" buttonStyle="solid">
            <Radio value={Number(BasicStatus.ENABLE)}>启用</Radio>
            <Radio value={Number(BasicStatus.DISABLE)}>禁用</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="排序" name="sort" rules={[{ required: true, message: '排序不能为空' }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
