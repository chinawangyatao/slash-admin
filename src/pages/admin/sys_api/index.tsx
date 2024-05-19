import { Button, Card, message, Popconfirm } from 'antd';
import Table from 'antd/es/table';
import { useEffect, useState } from 'react';

import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

import { Permission } from '#/entity';
import { BasicStatus, MethodEnum, PermissionType, SySApiEnum } from '#/enum';
import { useMutation, useQuery } from '@tanstack/react-query';
import sysService from '@/api/services/sysService.ts';
import { fHour } from '@/utils/format-day.ts';
import { SysApiItem } from '#/api.ts';
import PostDrawer, { PostDrawerProps } from '@/pages/admin/sys_post/post-drawer.tsx';

const defaultSysApiValue: SysApiItem = {
  handle: null, // handle
  name: null, // 名称
  path: null, // 地址
  method: null, // 请求类型
  type: null, // 接口类型
  bus: null, // 业务模块
  project: null, // 项目名称
  isHistory: null, // 是否历史接口
  func: null, // func
};
export default function Index() {
  const [messageApi, contextHolder] = message.useMessage();

  const [findPostParams, setFindPostParams] = useState({
    current: 1,
    pageSize: 20,
  });
  const findApi = useQuery(['findApi'], () => sysService.findApi(findPostParams));
  const createMenu = useMutation(sysService.createMenu);
  const updateMenu = useMutation(sysService.updateMenu);

  const [pageData, setPageData] = useState({
    tableData: findApi.data?.data || [],
  });

  useEffect(() => {
    setPageData((prevState) => ({
      ...prevState,
      tableData: findApi.data?.data || [],
    }));
  }, [findApi.data?.data]);

  const [permissionModalProps, setPermissionModalProps] = useState<PostDrawerProps | any>({
    formValue: { ...defaultSysApiValue },
    title: '新增',
    show: false,
    onOk: (title, data) => {
      if (title == '新增') {
        createMenu.mutate(
          { ...data },
          {
            onSuccess: (resp) => {
              if (resp.success) {
                findApi.refetch();
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
              findApi.refetch();
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
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (name, record) => (
        <label>
          <ProTag color={SySApiEnum[record.type]}>{record.type}</ProTag>
          {name}
        </label>
      ),
    },
    {
      title: '项目',
      dataIndex: 'project',
    },
    {
      title: '业务',
      dataIndex: 'bus',
    },
    {
      title: 'func',
      dataIndex: 'func',
    },
    {
      title: '历史',
      dataIndex: 'isHistory',
      render: (isHistory) => (
        <ProTag color={!!isHistory ? 'green' : 'red'}>{!!isHistory ? '是' : '否'}</ProTag>
      ),
    },
    {
      title: '接口地址',
      dataIndex: 'path',
      render: (path, record) => (
        <label>
          <ProTag color={MethodEnum[record.method]}>{record.method}</ProTag>
          {path}
        </label>
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
            findApi.refetch();
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
      ...defaultSysApiValue,
      title: '新增',
      formValue: { ...defaultSysApiValue, parentId: parentId ?? 0 },
      tableData: pageData.tableData,
    }));
  };

  const onEdit = (formValue: Permission) => {
    setPermissionModalProps((prev) => ({
      ...prev,
      show: true,
      title: '编辑',
      formValue,
      tableData: pageData.tableData,
    }));
  };

  return (
    <>
      {contextHolder}
      <Card
        title="API管理"
        extra={
          <Button type="primary" onClick={() => onCreate()}>
            新增
          </Button>
        }
      >
        <Table
          expandable={{ defaultExpandAllRows: true }}
          rowKey={(record) => {
            return String(record); // 在这里加上一个时间戳就可以了
          }}
          size="small"
          pagination={false}
          columns={columns}
          dataSource={pageData.tableData}
        />
        <PostDrawer {...permissionModalProps} />
      </Card>
    </>
  );
}
