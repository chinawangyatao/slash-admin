import { Button, Card, message, Popconfirm } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { isNil } from 'ramda';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton, Iconify, SvgIcon } from '@/components/icon';
import { useUserPermission } from '@/store/userStore';
import ProTag from '@/theme/antd/components/tag';

import PermissionDrawer, { type PermissionModalProps } from './permission-drawer.tsx';

import { Permission } from '#/entity';
import { BasicStatus, PermissionType } from '#/enum';
import { useMutation, useQuery } from '@tanstack/react-query';
import sysService from '@/api/services/sysService.ts';
import { fHour } from '@/utils/format-day.ts';

const defaultPermissionValue: Permission = {
  id: '',
  parentId: '',
  name: '',
  label: '',
  route: '',
  component: '',
  path: '',
  sort: 0,
  permission: '',
  icon: '',
  hide: false,
  title: '',
  status: BasicStatus.ENABLE,
  menuType: PermissionType.CATALOGUE,
  menuName: '',
};
export default function PermissionPage() {
  const [messageApi, contextHolder] = message.useMessage();

  const [findMenuParams, setFindMenuParams] = useState({
    current: 1,
    pageSize: 20,
  });
  const findMenu = useQuery(['findMenu'], () => sysService.findMenu(findMenuParams));
  const createMenu = useMutation(sysService.createMenu);
  const updateMenu = useMutation(sysService.updateMenu);
  const treeData = [
    {
      menuId: 0,
      menuName: '根目录',
      menuType: '根',
      sort: '--',
      permission: '--',
      children: findMenu.data?.data || [],
    },
  ];
  const [permissionModalProps, setPermissionModalProps] = useState<PermissionModalProps | any>({
    formValue: { ...defaultPermissionValue },
    title: '新增',
    show: false,
    onOk: (title, data) => {
      if (title == '新增') {
        createMenu.mutate(
          { ...data },
          {
            onSuccess: (resp) => {
              if (resp.success) {
                findMenu.refetch();
                setPermissionModalProps((prev) => ({ ...prev, show: false }));
                messageApi.success('创建菜单成功！');
              } else {
                messageApi.error(resp.errorMessage);
              }
              console.log(resp);
            },
          },
        );
      } else {
        updateMenu.mutate(data, {
          onSuccess: (resp) => {
            if (resp.success) {
              findMenu.refetch();
              setPermissionModalProps((prev) => ({ ...prev, show: false }));
              messageApi.success('更新菜单成功！');
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
      title: '中文名称',
      dataIndex: 'menuName',
    },
    {
      title: '权限标记',
      dataIndex: 'permission',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '隐藏',
      dataIndex: 'visible',
      render: (_, record) => (
        <ProTag color={record.visible ? 'red' : 'green'}>{record.visible ? '隐藏' : '显示'}</ProTag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'menuType',
      render: (_, record) => (
        <ProTag
          color={record.menuType === 'M' ? 'error' : record.menuType === 'C' ? 'blue' : 'purple'}
        >
          {record.menuType}
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
        record.menuId !== 0 ? (
          <div className="flex w-full justify-end text-gray">
            {record?.type === PermissionType.CATALOGUE && (
              <IconButton onClick={() => onCreate(record.id)}>
                <Iconify icon="gridicons:add-outline" size={18} />
              </IconButton>
            )}
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
  const deleteMenu = useMutation(sysService.deleteMenu);
  const deleteHandle = (record: any) => {
    deleteMenu.mutate(
      { ids: [record.menuId] },
      {
        onSuccess: (res) => {
          if (res.success) {
            messageApi.success('删除成功！');
            findMenu.refetch();
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
      ...defaultPermissionValue,
      title: '新增',
      formValue: { ...defaultPermissionValue, parentId: parentId ?? 0 },
      treeData: treeData,
    }));
  };

  const onEdit = (formValue: Permission) => {
    setPermissionModalProps((prev) => ({
      ...prev,
      show: true,
      title: '编辑',
      formValue,
      treeData: treeData,
    }));
  };

  return (
    <>
      {contextHolder}
      <Card
        title="菜单管理"
        extra={
          <Button type="primary" onClick={() => onCreate()}>
            新增
          </Button>
        }
      >
        <Table
          expandable={{ defaultExpandAllRows: true }}
          rowKey={(record) => {
            return String(record.menuId); // 在这里加上一个时间戳就可以了
          }}
          size="small"
          pagination={false}
          columns={columns}
          dataSource={treeData}
        />

        <PermissionDrawer {...permissionModalProps} />
      </Card>
    </>
  );
}
