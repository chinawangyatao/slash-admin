import { Button, Card, message, Popconfirm } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useRef, useState } from 'react';

import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

import { RoleModal, RoleModalProps } from './role-modal';

import { Role } from '#/entity';
import { BasicStatus } from '#/enum';
import { useMutation, useQuery } from '@tanstack/react-query';
import sysService from '@/api/services/sysService.ts';
import { IGetSysUser } from '#/api.ts';
import { fHour } from '@/utils/format-day.ts';

const DEFAULE_ROLE_VALUE: Role = {
  roleName: '',
  status: BasicStatus.ENABLE,
  roleKey: '',
  menuIds: [],
  remark: '',
  admin: null,
  createBy: null,
  dataScope: null,
  deptIds: null,
  flag: null,
  roleSort: null,
  sysDept: null,
  sysMenu: null,
  updateBy: null,
};
export default function RolePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const createRole = useMutation(sysService.createRole);
  const updateRole = useMutation(sysService.updateRole);
  const findRoleById = useMutation(sysService.findRoleById);
  const [roleModalPros, setRoleModalProps] = useState<RoleModalProps>({
    formValue: { ...DEFAULE_ROLE_VALUE },
    title: '新增',
    show: false,
    onOk: (title, formData) => {
      const params = { ...formData };
      // delete params.sysMenu;
      if (title === '新增') {
        delete params.roleId;
        createRole.mutate(params, {
          onSuccess: (resp) => {
            if (resp.success) {
              messageApi.success('角色权限创建成功！');
              setRoleModalProps((prev) => ({ ...prev, show: false }));
              findRole.refetch();
            } else {
              messageApi.error(resp.errorMessage);
            }
          },
        });
      } else {
        updateRole.mutate(params, {
          onSuccess: (resp) => {
            if (resp.success) {
              messageApi.success('角色权限更新成功！');
              setRoleModalProps((prev) => ({ ...prev, show: false }));
              findRole.refetch();
            } else {
              messageApi.error(resp.errorMessage);
            }
          },
        });
      }
    },
    onCancel: () => {
      setRoleModalProps((prev) => ({ ...prev, show: false }));
    },
  });

  const paramsSysUser = useRef<IGetSysUser>({
    pageSize: 10,
    current: 1,
    createdAtOrder: null,
  });

  const findRole = useQuery(['findRole'], () => sysService.findRole(paramsSysUser));
  const deleteRole = useMutation(sysService.deleteRole);

  const deleteRoleHandle = (id: number) => {
    deleteRole.mutate(
      { ids: [id] },
      {
        onSuccess: (resp) => {
          if (resp.success) {
            messageApi.success('删除成功！');
            findRole.refetch();
          } else {
            messageApi.error(resp.errorMessage);
          }
        },
      },
    );
  };
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
        <ProTag color={status === '2' ? 'success' : 'error'}>
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
          <Popconfirm
            title="删除这个角色？"
            okText="确认"
            cancelText="取消"
            placement="left"
            onConfirm={() => deleteRoleHandle(record.roleId)}
          >
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
      title: '新增',
      formValue: {
        ...prev.formValue,
        ...DEFAULE_ROLE_VALUE,
      },
    }));
  };

  const onEdit = async (formValue: Role) => {
    await findRoleById.mutateAsync(formValue.roleId, {
      onSuccess: (resp) => {
        if (resp.success) {
          setRoleModalProps((prev) => ({
            ...prev,
            show: true,
            title: '编辑',
            // formValue: { ...formValue, ...resp.data },
            formValue: { ...resp.data },
          }));
        } else {
          messageApi.error(resp.errorMessage);
        }
      },
    });
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
