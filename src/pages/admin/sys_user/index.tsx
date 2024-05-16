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
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';
import { useThemeToken } from '@/theme/hooks';
import Search from 'antd/es/input/Search';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import sysUserService from '@/api/services/sysService.ts';
import TextArea from 'antd/es/input/TextArea';
import dictService from '@/api/services/dictService.ts';
import { IGetSysUser } from '#/api.ts';
import { fHour } from '@/utils/format-day.ts';
import UserDetail from '@/pages/admin/sys_user/detail.tsx';

export default function RolePage() {
  const { colorTextSecondary } = useThemeToken();

  const [treeData, setTreeData] = useState();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [titleDrawer, setTitleDrawer] = useState('');
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const paramsSysUser = useRef<IGetSysUser>({
    pageSize: 10,
    current: 1,
    createdAtOrder: null,
  });

  // 请求数据
  const deptTreeData = useQuery<any>(['deptTree'], sysUserService.findTreeData);
  const dictRole = useQuery(['dictRole'], dictService.findDictDataRoleOption);
  const dictPost = useQuery(['dictPost'], dictService.findDictDataPostOption);
  const dictSex = useQuery(['dictSex'], () => dictService.findOptionSelect('sys_user_sex'));
  const updateSysUserStatus = useMutation(sysUserService.updateSysUserStatus);
  const deleteSysUser = useMutation(sysUserService.deleteSysUser);
  // sys_user_sex
  const createSysUser = useMutation(sysUserService.createSysUser);
  const findSysUser = useQuery(['findSysUser'], () =>
    sysUserService.findSysUser(paramsSysUser.current),
  );
  const updateSysUser = useMutation(sysUserService.updateSysUser);
  const [userId, setUserId] = useState<string | null>();

  const detailHandle = (value: string | null | undefined) => {
    setUserId(value);
    setTitleDrawer('详情');
    setOpenDrawer(true);
  };

  useEffect(() => {
    if (deptTreeData.isSuccess) setTreeData(deptTreeData.data.data);
  }, [deptTreeData.data, dictRole.data, dictPost.data, dictSex.data, findSysUser.data]);
  const searchOnChange = (value: string) => {
    messageApi.warning('尚未开发，//todo');
  };

  const onPopupScroll = () => {};

  const submitHandle = () => {
    if (titleDrawer === '编辑') {
      form
        .validateFields()
        .then(async (res) => {
          updateSysUser.mutate(
            { ...res, userId: userId },
            {
              onSuccess: async (resp) => {
                if (resp.success) {
                  form.resetFields();
                  messageApi.success('编辑成功');
                  await findSysUser.refetch();
                  setOpenDrawer(false);
                } else {
                  messageApi.error(updateSysUser.data?.errorMessage as any);
                }
              },
            },
          );
        })
        .catch(() => {
          messageApi.error('请完善信息！');
        });
    } else {
      form
        .validateFields()
        .then(async (res) => {
          await createSysUser.mutateAsync(res, {
            onSuccess: async (resp) => {
              if (resp.success) {
                form.resetFields();
                messageApi.success('新增成功');
                await findSysUser.refetch();
                setOpenDrawer(false);
              } else {
                messageApi.error(createSysUser.data?.errorMessage as any);
              }
            },
          });
        })
        .catch((e) => {
          messageApi.error('请完善信息！');
        });
    }
  };

  const editHandle = async (id) => {
    const findSysUserById = await sysUserService.findSysUserById(id);
    setUserId(id);
    setOpenDrawer(true);
    setTitleDrawer('编辑');
    form.setFieldsValue(findSysUserById.data);
  };

  const treeSelectHandle = (selectedKeys) => {
    if (!selectedKeys.length) {
      paramsSysUser.current.deptId = null;
      findSysUser.refetch();
      return;
    }

    paramsSysUser.current.deptId = selectedKeys[0];
    findSysUser.refetch();
  };

  const changeSysUserStatus = (value: any) => {
    if (Number(value.status) == 1) {
      value.status = '2';
    } else if (Number(value.status) == 2) {
      value.status = '1';
    }
    updateSysUserStatus.mutate(value, {
      onSuccess: (resp) => {
        if (resp.success) {
          findSysUser.refetch();
          messageApi.success('更新状态成功！');
        } else {
          messageApi.error('更新状态失败！');
        }
      },
    });
  };
  const columns: ColumnsType<any> = [
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
      render: (status, record) => {
        return (
          <Switch
            disabled={record.username === 'admin'}
            value={status !== 1}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            defaultChecked
            onChange={() => changeSysUserStatus(record)}
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
          <IconButton onClick={() => detailHandle(String(record.userId))}>
            <Iconify icon="mdi:card-account-details" size={18} />
          </IconButton>
          <IconButton onClick={() => editHandle(record.userId)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm
            title="删除这个用户？"
            okText="确定"
            cancelText="取消"
            placement="left"
            onConfirm={() => {
              deleteSysUser.mutate(
                { id: record.userId },
                {
                  onSuccess: (reps) => {
                    if (reps.success) {
                      findSysUser.refetch();
                      messageApi.success('删除成功！');
                    } else {
                      messageApi.error(reps.errorMessage);
                    }
                  },
                },
              );
            }}
          >
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
        <Col span={5} className={'pr-5'}>
          <Search style={{ marginBottom: 8 }} placeholder="搜素部门" onSearch={searchOnChange} />
          <Tree
            fieldNames={{ title: 'label', key: 'value' }}
            onSelect={treeSelectHandle}
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
                  setOpenDrawer(true);
                  setTitleDrawer('新增');
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
              <Button disabled={createSysUser.isLoading} type={'primary'} onClick={submitHandle}>
                确定
              </Button>
              <Button
                disabled={createSysUser.isLoading}
                type={'text'}
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
          <Spin spinning={createSysUser.isLoading || updateSysUser.isLoading}>
            <Form form={form} labelCol={{ span: 5 }}>
              <Form.Item
                label={'昵称'}
                name={'nickName'}
                rules={[{ message: '请输入昵称', required: true }]}
              >
                <Input placeholder={'请输入昵称'} />
              </Form.Item>
              <Form.Item
                label={'部门'}
                name={'deptId'}
                rules={[{ message: '请输入部门', required: true }]}
              >
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择"
                  allowClear
                  treeDefaultExpandAll
                  treeData={treeData}
                  onPopupScroll={onPopupScroll}
                />
              </Form.Item>
              <Form.Item
                label={'用户名'}
                name={'username'}
                rules={[{ message: '请输入用户名', required: true }]}
              >
                <Input placeholder={'请输入用户名'} />
              </Form.Item>
              <Form.Item
                label={'手机号'}
                name={'phone'}
                rules={[{ message: '请输入手机号', required: true }]}
              >
                <Input placeholder={'请输入手机号'} />
              </Form.Item>
              <Form.Item label={'性别'} name={'sex'}>
                <Select placeholder={'请选择性别'} options={dictSex.data?.data || []}></Select>
              </Form.Item>
              <Form.Item
                label={'电子邮箱'}
                name={'email'}
                rules={[{ message: '请输入电子邮箱', required: true }]}
              >
                <Input placeholder={'请输入电子邮箱'} />
              </Form.Item>
              <Form.Item
                label={'职位'}
                name={'postId'}
                rules={[{ message: '请选择职位', required: true }]}
              >
                <Select placeholder={'请选择职位'} options={dictPost.data?.data || []}></Select>
              </Form.Item>
              <Form.Item
                label={'角色'}
                name={'roleId'}
                rules={[{ message: '请选择角色', required: true }]}
              >
                <Select placeholder={'请选择角色'} options={dictRole.data?.data || []}></Select>
              </Form.Item>
              <Form.Item
                label={'状态'}
                name={'status'}
                rules={[{ message: '请选择状态', required: true }]}
              >
                <Radio.Group>
                  <Radio value={'2'}>启用</Radio>
                  <Radio value={'1'}>停用</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label={'备注'} name={'remark'}>
                <TextArea />
              </Form.Item>
            </Form>
          </Spin>
        ) : (
          <UserDetail
            userId={userId}
            dictSex={dictSex.data}
            dictPost={dictPost.data}
            dictRole={dictRole.data}
            deptTreeData={deptTreeData.data}
          />
        )}
      </Drawer>
    </>
  );
}

// const SysUserWrapper = styled.div``;
