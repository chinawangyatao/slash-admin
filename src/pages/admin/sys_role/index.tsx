import { Button, Card, message, Popconfirm } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useRef, useState } from 'react';

import { ROLE_LIST } from '@/_mock/assets';
import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

import { RoleModal, RoleModalProps } from './role-modal';

import { Role } from '#/entity';
import { BasicStatus } from '#/enum';
import { useQuery } from '@tanstack/react-query';
import sysService from '@/api/services/sysService.ts';
import { IGetSysUser } from '#/api.ts';
import { fHour } from '@/utils/format-day.ts';

const ROLES: Role[] = ROLE_LIST;

const DEFAULE_ROLE_VALUE: Role = {
  id: '',
  name: '',
  label: '',
  status: BasicStatus.ENABLE,
  permission: [],
};
export default function RolePage() {
  const [roleModalPros, setRoleModalProps] = useState<RoleModalProps>({
    formValue: { ...DEFAULE_ROLE_VALUE },
    title: '新增',
    show: false,
    onOk: () => {
      setRoleModalProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setRoleModalProps((prev) => ({ ...prev, show: false }));
    },
  });
  const [messageApi, contextHolder] = message.useMessage();
  const paramsSysUser = useRef<IGetSysUser>({
    pageSize: 10,
    current: 1,
    createdAtOrder: null,
  });

  const findRole = useQuery(['findRole'], () => sysService.findRole(paramsSysUser));

  const columns: ColumnsType<Role> = [
    {
      title: '编码',
      dataIndex: 'roleId',
    },
    {
      title: '名称',
      dataIndex: 'roleName',
    },
    { title: '排序', dataIndex: 'roleSort' },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (status) => (
        <ProTag color={status === '2' ? 'error' : 'success'}>
          {status === '2' ? '正常' : '停用'}
        </ProTag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (status) => <label>{fHour(status)}</label>,
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <IconButton onClick={() => onEdit(record)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm title="Delete the Role" okText="Yes" cancelText="No" placement="left">
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onCreate = () => {
    setRoleModalProps((prev) => ({
      ...prev,
      show: true,
      title: 'Create New',
      formValue: {
        ...prev.formValue,
        ...DEFAULE_ROLE_VALUE,
      },
    }));
  };

  const onEdit = (formValue: Role) => {
    setRoleModalProps((prev) => ({
      ...prev,
      show: true,
      title: 'Edit',
      formValue,
    }));
  };

  return (
    <>
      {contextHolder}
      <Card
        extra={
          <Button type="primary" onClick={onCreate}>
            新增
          </Button>
        }
      >
        <Table
          rowKey="id"
          size="small"
          scroll={{ x: 'max-content' }}
          pagination={false}
          columns={columns}
          dataSource={findRole.data?.data || []}
        />

        <RoleModal {...roleModalPros} />
      </Card>
    </>
  );
}
