import {
  Form,
  Input,
  InputNumber,
  Radio,
  Tree,
  Drawer,
  Space,
  Button,
  Select,
  Divider,
} from 'antd';
import { useEffect, useState } from 'react';

import { Role } from '#/entity';
import { BasicStatus } from '#/enum';
import { useQuery } from '@tanstack/react-query';
import sysService from '@/api/services/sysService.ts';

export type RoleModalProps = {
  formValue: Role;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
const scopeTypeSelectOption = [
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' },
];
export function RoleModal({ title, show, formValue, onOk, onCancel }: RoleModalProps) {
  const [form] = Form.useForm();
  const [formTreeData, setFormTreeData] = useState(formValue);
  const checkedKeys = (keys) => {
    setFormTreeData((prevState) => [...keys]);
    form.setFieldValue('menuIds', keys);
  };
  useEffect(() => {
    setFormTreeData([...formValue.menuIds] || []);
    form.setFieldsValue({ ...formValue });
    console.log('formTreeData', formTreeData);
    console.log('formValue', { ...formValue });
  }, [formValue]);

  const findRoleMenuTreeSelect = useQuery(
    ['findRoleMenuTreeSelect'],
    sysService.findRoleMenuTreeSelect,
  );

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
                  console.log(formData);
                  onOk(title, { ...formData, roleId: formValue.roleId });
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
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Divider children={'基本信息'} />
        <Form.Item<Role>
          label="名称"
          name="roleName"
          rules={[{ required: true, message: '名称不能为空' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<Role>
          label="Key"
          name="roleKey"
          rules={[{ required: true, message: 'Key不能为空' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<Role> label="排序" name="roleSort">
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item<Role>
          label="状态"
          name="status"
          rules={[{ required: true, message: '状态不能为空' }]}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={BasicStatus.ENABLE}> 启用 </Radio>
            <Radio value={BasicStatus.DISABLE}> 禁用 </Radio>
          </Radio.Group>
        </Form.Item>
        <Divider children={'权限'} />
        <Form.Item<Role> label="角色权限" name="menuIds">
          <Tree
            checkedKeys={formTreeData || []}
            defaultCheckedKeys={formTreeData || []}
            key="roleKey"
            multiple
            onCheck={checkedKeys}
            checkable
            treeData={findRoleMenuTreeSelect.data?.data.menus}
            fieldNames={{
              // key: 'key',
              // children: 'children',
              title: 'menuName',
            }}
          />
        </Form.Item>
        <Divider children={'数据范围'} />
        <Form.Item<Role> label="数据范围" name="dataScope">
          <Select options={scopeTypeSelectOption} />
        </Form.Item>
        <Form.Item<Role> label="备注" name="remark">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
