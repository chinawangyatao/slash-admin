import { Button, Drawer, Form, Input, InputNumber, Radio, Space, TreeSelect } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { useUserPermission } from '@/store/userStore';

import { Permission } from '#/entity';
import { PermissionType } from '#/enum';

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
                  onOk(title, { ...formData, menuId: formValue.menuId });
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
          label="类型"
          name="menuType"
          rules={[{ required: true, message: '类型不能为空' }]}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={PermissionType.CATALOGUE}>目录</Radio>
            <Radio value={PermissionType.MENU}>菜单</Radio>
            {/* <Radio value={PermissionType.BUTTON}>按钮</Radio> */}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="菜单名称"
          name="menuName"
          rules={[{ required: true, message: '菜单名称不能为空' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="国际化key"
          name="title"
          rules={[{ required: true, message: '国际化key不能为空' }]}
          tooltip="菜单多语言key，对应多语言的说明信息 config"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="上级菜单"
          name="parentId"
          rules={[{ required: true, message: '上级菜单不能为空' }]}
        >
          <TreeSelect
            fieldNames={{
              label: 'menuName',
              value: 'menuId',
              children: 'children',
            }}
            allowClear
            treeData={treeData}
            onChange={(_value, labelList) => {}}
          />
        </Form.Item>

        <Form.Item
          label="路由"
          name="path"
          tooltip="访问此页面自定义的url地址，建议/开头书写，例如/app-name"
          rules={[{ required: true, message: '路由不能为空' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="文件路径"
          name="component"
          tooltip="pages下面的文件路径，要带index"
          rules={[{ required: true, message: '文件路径不能为空' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="排序" name="sort" rules={[{ required: true, message: '排序不能为空' }]}>
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
