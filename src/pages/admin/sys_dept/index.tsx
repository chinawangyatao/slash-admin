import { Button, Card, message, Popconfirm } from 'antd';
import Table from 'antd/es/table';
import { useState } from 'react';

import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

import DeptDrawer, { type PermissionModalProps } from './dept-drawer.tsx';

import { Permission } from '#/entity';
import { BasicStatus, PermissionType } from '#/enum';
import { useMutation, useQuery } from '@tanstack/react-query';
import sysService from '@/api/services/sysService.ts';
import { fHour } from '@/utils/format-day.ts';
import { DeptListItem } from '#/api.ts';

const defaultDeptValue: DeptListItem = {
  status: BasicStatus.ENABLE,
  parentId: null,
  deptPath: null,
  deptName: null,
  sort: null,
  leader: null,
  phone: null,
  email: null,
  createBy: null,
  updateBy: null,
  createdAt: null,
  updatedAt: null,
  dataScope: null,
  params: null,
  children: [],
};
export default function PermissionPage() {
  const [messageApi, contextHolder] = message.useMessage();

  const [findDeptParams, setFindDeptParams] = useState({
    current: 1,
    pageSize: 20,
  });
  const findDept = useQuery(['findDept'], () => sysService.findDept(findDeptParams));
  const updateDept = useMutation(sysService.updateDept);
  const treeData = [
    {
      deptId: 0,
      deptName: '根目录',
      status: '根',
      sort: '--',
      permission: '--',
      children: findDept.data?.data || [],
    },
  ];
  const creatDept = useMutation(sysService.creatDept);
  const [permissionModalProps, setPermissionModalProps] = useState<PermissionModalProps | any>({
    formValue: { ...defaultDeptValue },
    title: '新增',
    show: false,
    onOk: (title: string, data: any) => {
      if (title == '新增') {
        creatDept.mutate(
          { ...data },
          {
            onSuccess: (resp) => {
              if (resp.success) {
                findDept.refetch();
                setPermissionModalProps((prev) => ({ ...prev, show: false }));
                messageApi.success('创建部门成功！');
              } else {
                messageApi.error(resp.errorMessage);
              }
            },
          },
        );
      } else {
        updateDept.mutate(data, {
          onSuccess: (resp) => {
            if (resp.success) {
              findDept.refetch();
              setPermissionModalProps((prev) => ({ ...prev, show: false }));
              messageApi.success('更新部门成功！');
            } else {
              messageApi.error(resp.errorMessage);
            }
          },
        });
      }
    },
    onCancel: () => {
      setPermissionModalProps((prev) => ({ ...prev, show: false }));
    },
  });
  const columns: any = [
    {
      title: '名称',
      dataIndex: 'deptName',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <ProTag
          color={status === '根' ? 'purple' : status == BasicStatus.DISABLE ? 'error' : 'success'}
        >
          {status === '根' ? status : status == BasicStatus.DISABLE ? '禁用' : '启用'}
        </ProTag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (_, record) => <div>{fHour(record.createdAt)}</div>,
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) =>
        record.deptId !== 0 ? (
          <div className="flex w-full justify-end text-gray">
            <IconButton onClick={() => onEdit(record)}>
              <Iconify icon="solar:pen-bold-duotone" size={18} />
            </IconButton>
            <Popconfirm
              title="删除菜单？"
              okText="确定"
              cancelText="取消"
              placement="left"
              onConfirm={() => deleteHandle(record)}
            >
              <IconButton>
                <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
              </IconButton>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];
  const deleteDept = useMutation(sysService.deleteDept);
  const deleteHandle = (record: any) => {
    deleteDept.mutate(
      { ids: [record.deptId] },
      {
        onSuccess: (res) => {
          if (res.success) {
            messageApi.success('删除成功！');
            findDept.refetch();
          } else {
            messageApi.error(res.errorMessage);
          }
        },
      },
    );
  };

  const onCreate = (parentId?: string) => {
    setPermissionModalProps((prev) => ({
      ...prev,
      show: true,
      ...defaultDeptValue,
      title: '新增',
      formValue: { ...defaultDeptValue, parentId: parentId ?? 0 },
      treeData: treeData,
    }));
  };

  const findDeptById = useMutation(sysService.findDeptById);

  const onEdit = (formValue: Permission) => {
    findDeptById.mutate(formValue.deptId, {
      onSuccess: (resp) => {
        if (resp.success) {
          setPermissionModalProps((prev) => ({
            ...prev,
            show: true,
            title: '编辑',
            formValue: resp.data,
            treeData: treeData,
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
        title="部门管理"
        extra={
          <Button type="primary" onClick={() => onCreate()}>
            新增
          </Button>
        }
      >
        <Table
          expandable={{ defaultExpandAllRows: true }}
          rowKey={(record) => {
            return String(record.deptId); // 在这里加上一个时间戳就可以了
          }}
          size="small"
          pagination={false}
          columns={columns}
          dataSource={treeData}
        />

        <DeptDrawer {...permissionModalProps} />
      </Card>
    </>
  );
}
