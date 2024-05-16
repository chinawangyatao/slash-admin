import {
  AutoComplete,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Space,
  TreeSelect,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { pagesSelect } from '@/router/hooks/use-permission-routes';
import { useUserPermission } from '@/store/userStore';

import { Permission } from '#/entity';
import { BasicStatus, PermissionType } from '#/enum';

export type PermissionModalProps = {
  formValue: Permission;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
  treeData?: any;
  [key: string]: any;
};

export default function PermissionDrawer({
  title,
  show,
  formValue,
  treeData,
  onOk,
  onCancel,
}: PermissionModalProps) {
  const [form] = Form.useForm();
  const permissions = useUserPermission();
  const [compOptions, setCompOptions] = useState(pagesSelect);

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

  const updateCompOptions = (name: string) => {
    setCompOptions(
      pagesSelect.filter((path) => {
        return path.value.includes(name.toLowerCase());
      }),
    );
  };

  useEffect(() => {
    form.setFieldsValue({ ...formValue });
    if (formValue.parentId) {
      const parentName = getParentNameById(formValue.parentId);
      updateCompOptions(parentName);
    }
  }, [formValue, form, getParentNameById]);

  return (
    <Drawer
      destroyOnClose
      width={550}
      title={title}
      open={show}
      onClose={onCancel}
      footer={
        <Space>
          <Button
            type={'primary'}
            onClick={() => {
              form.validateFields().then((formData) => {
                onOk(title, { ...formData, menuId: formValue.menuId });
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
        <Form.Item label="类型" name="menuType" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={PermissionType.CATALOGUE}>目录</Radio>
            <Radio value={PermissionType.MENU}>菜单</Radio>
            <Radio value={PermissionType.BUTTON}>按钮</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="菜单名称" name="menuName" required>
          <Input />
        </Form.Item>

        <Form.Item
          label="国际化key"
          name="title"
          required
          tooltip="菜单多语言key，对应多语言的说明信息 config"
        >
          <Input />
        </Form.Item>

        <Form.Item label="上级菜单" name="parentId" required>
          <TreeSelect
            fieldNames={{
              label: 'menuName',
              value: 'menuId',
              children: 'children',
            }}
            allowClear
            treeData={treeData}
            onChange={(_value, labelList) => {
              updateCompOptions(labelList[0] as string);
            }}
          />
        </Form.Item>

        <Form.Item
          label="路径"
          name="path"
          tooltip="访问此页面自定义的url地址，建议/开头书写，例如/app-name"
          required
        >
          <Input />
        </Form.Item>

        <Form.Item label="排序" name="sort" required>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Icon" name="icon" tooltip="local icon should start with ic">
          <Input />
        </Form.Item>

        <Form.Item label="隐藏" name="visible" tooltip="hide in menu">
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={false}>显示</Radio>
            <Radio value>隐藏</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="权限" name="permission">
          <Input />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
