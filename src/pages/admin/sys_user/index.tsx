import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Tree,
  TreeSelect,
  message,
  Switch,
  Descriptions,
} from 'antd';
import Search from 'antd/es/input/Search';
import TextArea from 'antd/es/input/TextArea';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';

import dictService from '@/api/services/dictService.ts';
import sysUserService from '@/api/services/sysUserService.ts';
import { IconButton, Iconify } from '@/components/icon';
import { usePathname, useRouter } from '@/router/hooks';
import ProTag from '@/theme/antd/components/tag';
import { useThemeToken } from '@/theme/hooks';
import { fHour } from '@/utils/format-day.ts';

import { IGetSysUser } from '#/api.ts';
import type { UserInfo } from '#/entity';

export default function RolePage() {
  const { colorTextSecondary } = useThemeToken();
  const { push } = useRouter();
  const pathname = usePathname();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [treeData, setTreeData] = useState();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [titleDrawer, setTitleDrawer] = useState('');
  const [detailData, setDetailData] = useState<any>();
  const [userId, setUserId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const paramsSysUser = useRef<IGetSysUser>({
    pageSize: 10,
    current: 1,
    createdAtOrder: 'desc',
  });
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  // 请求数据
  const deptTreeData = useQuery<any>(['deptTree'], sysUserService.findTreeData);
  const dictRole = useQuery(['dictRole'], dictService.findDictDataRoleOption);
  const dictPost = useQuery(['dictPost'], dictService.findDictDataPostOption);
  const dictSex = useQuery(['dictSex'], () => dictService.findOptionSelect('sys_user_sex'));
  // sys_user_sex
  const updateSysUser = useMutation(sysUserService.updateSysUser);
  const findSysUser = useQuery(['findSysUser'], () => sysUserService.findSysUser(paramsSysUser));
  const findSysUserById = useQuery(['findSysUserById'], () =>
    sysUserService.findSysUserById(userId),
  );

  useEffect(() => {
    if (deptTreeData.isSuccess) setTreeData(deptTreeData.data.data);
  }, [deptTreeData.data, dictRole.data, dictPost.data, dictSex.data, findSysUser.data]);

  const detailHandle = (id: string | null) => {
    setUserId(id);
    setTitleDrawer('详情');
    setOpenDrawer(true);
  };

  const searchOnChange = (value: string) => {
    messageApi.warning('尚未开发，//todo');
  };

  const selectTreeChange = (v) => {
    console.log(v);
  };

  const onPopupScroll = () => {};

  const submitHandle = () => {
    form
      .validateFields()
      .then(async (res) => {
        await updateSysUser.mutateAsync(res);
        if (updateSysUser.data?.success) {
          form.resetFields();
          setOpenDrawer(false);
        } else {
          messageApi.error(updateSysUser.data?.errorMessage as any);
        }
      })
      .catch(() => {
        messageApi.error('请填必填项');
      });
  };

  const columns: ColumnsType<UserInfo> = [
    {
      title: '编码',
      dataIndex: 'userId',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '手机',
      dataIndex: 'phone',
    },
    {
      title: '部门',
      dataIndex: 'dept',
      align: 'center',
      render: (dept: { deptId: number; deptName: string }) => (
        <ProTag color="cyan">{dept.deptName}</ProTag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (status) => {
        return (
          <Switch
            disabled={status === 2}
            value={status !== 1}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            defaultChecked
          />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      width: 180,
      render: (value) => <>{fHour(value)}</>,
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <IconButton onClick={() => detailHandle(record.userId)}>
            <Iconify icon="mdi:card-account-details" size={18} />
          </IconButton>
          <IconButton onClick={() => {}}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm title="Delete the User" okText="Yes" cancelText="No" placement="left">
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={5} className="pr-5">
          <Search style={{ marginBottom: 8 }} placeholder="搜素部门" onSearch={searchOnChange} />
          <Tree
            defaultExpandAll
            autoExpandParent
            fieldNames={{ title: 'label', key: 'value' }}
            // onExpand={onExpand}
            // expandedKeys={expandedKeys}
            // autoExpandParent={autoExpandParent}
            treeData={treeData || []}
          />
        </Col>
        <Col span={19}>
          <Card
            title="用户管理"
            extra={
              <Button
                type="primary"
                onClick={() => {
                  setTitleDrawer('新增');
                  setOpenDrawer(true);
                }}
              >
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
              dataSource={findSysUser.data?.data || []}
            />
          </Card>
        </Col>
      </Row>

      <Drawer
        width={450}
        open={openDrawer}
        title={titleDrawer}
        onClose={() => setOpenDrawer(false)}
        footer={
          titleDrawer !== '详情' ? (
            <Space>
              <Button disabled={updateSysUser.isLoading} type="primary" onClick={submitHandle}>
                确定
              </Button>
              <Button
                disabled={updateSysUser.isLoading}
                type="text"
                onClick={() => {
                  form.resetFields();
                  setOpenDrawer(false);
                }}
              >
                取消
              </Button>
            </Space>
          ) : null
        }
      >
        {titleDrawer !== '详情' ? (
          <Spin spinning={updateSysUser.isLoading}>
            <Form form={form} labelCol={{ span: 5 }}>
              <Form.Item
                label="昵称"
                name="nickName"
                rules={[{ message: '请输入昵称', required: true }]}
              >
                <Input placeholder="请输入昵称" />
              </Form.Item>
              <Form.Item
                label="部门"
                name="deptId"
                rules={[{ message: '请输入部门', required: true }]}
              >
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择"
                  allowClear
                  treeDefaultExpandAll
                  onChange={selectTreeChange}
                  treeData={treeData}
                  onPopupScroll={onPopupScroll}
                />
              </Form.Item>
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ message: '请输入用户名', required: true }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item
                label="手机号"
                name="phone"
                rules={[{ message: '请输入手机号', required: true }]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item label="性别" name="sex">
                <Select placeholder="请选择性别" options={dictSex.data?.data || []} />
              </Form.Item>
              <Form.Item
                label="电子邮箱"
                name="email"
                rules={[{ message: '请输入电子邮箱', required: true }]}
              >
                <Input placeholder="请输入电子邮箱" />
              </Form.Item>
              <Form.Item
                label="职位"
                name="postId"
                rules={[{ message: '请选择职位', required: true }]}
              >
                <Select placeholder="请选择职位" options={dictPost.data?.data || []} />
              </Form.Item>
              <Form.Item
                label="角色"
                name="roleId"
                rules={[{ message: '请选择角色', required: true }]}
              >
                <Select placeholder="请选择角色" options={dictRole.data?.data || []} />
              </Form.Item>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ message: '请选择状态', required: true }]}
              >
                <Radio.Group>
                  <Radio value="2">启用</Radio>
                  <Radio value="1">停用</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="备注" name="remark">
                <TextArea />
              </Form.Item>
            </Form>
          </Spin>
        ) : (
          <Spin spinning={findSysUserById.isLoading}>
            <Descriptions column={1} labelStyle={{ width: '80px' }} items={detailData} />
          </Spin>
        )}
      </Drawer>
    </>
  );
}

// const SysUserWrapper = styled.div``;
