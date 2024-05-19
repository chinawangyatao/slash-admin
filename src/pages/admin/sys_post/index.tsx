import { Button, Card, message, Popconfirm } from 'antd';
import Table from 'antd/es/table';
import { useEffect, useState } from 'react';

import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

import { Permission } from '#/entity';
import { BasicStatus, PermissionType } from '#/enum';
import { useMutation, useQuery } from '@tanstack/react-query';
import sysService from '@/api/services/sysService.ts';
import { fHour } from '@/utils/format-day.ts';
import { PostListItem } from '#/api.ts';
import PostDrawer, { PostDrawerProps } from '@/pages/admin/sys_post/post-drawer.tsx';

const defaultDeptValue: PostListItem = {
  postName: null,
  postCode: '',
  sort: null,
  remark: null,
  dataScope: null,
  params: null,
  createBy: null,
  updateBy: null,
  status: BasicStatus.ENABLE,
};
export default function Index() {
  const [messageApi, contextHolder] = message.useMessage();

  const [findPostParams, setFindPostParams] = useState({
    current: 1,
    pageSize: 20,
  });
  const findPost = useQuery(['findPost'], () => sysService.findPost(findPostParams));
  const createMenu = useMutation(sysService.createMenu);
  const updateMenu = useMutation(sysService.updateMenu);

  const [pageData, setPageData] = useState({
    tableData: findPost.data?.data || [],
  });

  useEffect(() => {
    setPageData((prevState) => ({
      ...prevState,
      tableData: findPost.data?.data || [],
    }));
  }, [findPost.data?.data]);

  const [permissionModalProps, setPermissionModalProps] = useState<PostDrawerProps | any>({
    formValue: { ...defaultDeptValue },
    title: '新增',
    show: false,
    onOk: (title, data) => {
      if (title == '新增') {
        createMenu.mutate(
          { ...data },
          {
            onSuccess: (resp) => {
              if (resp.success) {
                findPost.refetch();
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
              findPost.refetch();
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
      dataIndex: 'postName',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '代码',
      dataIndex: 'postCode',
      render: (postCode) => <ProTag color={'processing'}>{postCode}</ProTag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <ProTag color={status === BasicStatus.DISABLE ? 'error' : 'success'}>
          {status === BasicStatus.DISABLE ? '禁用' : '启用'}
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
            findPost.refetch();
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
        title="职位管理"
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
