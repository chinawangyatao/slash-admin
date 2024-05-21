import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, List, Popconfirm, Row, Space, Spin, Tag, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import { useMutation, useQuery } from '@tanstack/react-query';
import SysService from '@/api/services/sysService.ts';
import ProTag from '@/theme/antd/components/tag.tsx';
import { BasicStatus } from '#/enum.ts';
import Table from 'antd/es/table';
import { IconButton, Iconify } from '@/components/icon';
import useMessage from 'antd/es/message/useMessage';
import Dict_drawer from '@/pages/admin/sys_dict/dict_drawer.tsx';
import Dict_type_drawer from '@/pages/admin/sys_dict/dict_type_drawer.tsx';

export interface ITablePage {
  pageSize?: number;
  current?: number;
  dictName?: string | null;
  id?: number;
}
const initTablePage: ITablePage = {
  pageSize: 10,
  current: 1,
};

const defaultDictValue = {
  dictLabel: null,
  dictValue: null,
  dictSort: null,
  dictType: null,
  status: null,
  remark: null,
};

const Index = () => {
  const [messageApi, contextHolder] = useMessage();
  const [pageParams, setPageParams] = useState({
    tablePage: {
      ...initTablePage,
      dictName: null,
    },
    tableDictData: {
      ...initTablePage,
    },
  });

  const updateDictData = useMutation(SysService.updateDictData);
  const createDictData = useMutation(SysService.createDictData);

  const [pageData, setPageData] = useState({
    title: '',
    formValue: { ...defaultDictValue },
    show: false,
    onOk: (title, data) => {
      if (title == '新增') {
        createDictData.mutate(
          { ...data },
          {
            onSuccess: (resp) => {
              if (resp.success) {
                findDictDataById.refetch();
                setPageData((prev) => ({ ...prev, show: false }));
                messageApi.success('创建字典成功！');
              } else {
                messageApi.error(resp.errorMessage);
              }
            },
          },
        );
      } else {
        updateDictData.mutate(data, {
          onSuccess: (resp) => {
            if (resp.success) {
              findDictDataById.refetch();
              setPageData((prev) => ({ ...prev, show: false }));
              messageApi.success('更新字典成功！');
            } else {
              messageApi.error(resp.errorMessage);
            }
          },
        });
      }
    },
    onCancel: () => {
      setPageData((prev) => ({ ...prev, show: false }));
    },
  });

  const findDict = useQuery(['findDict'], () => SysService.findDict(pageParams.tablePage));
  let dictId = useRef(findDict.data?.data[0]?.dictId ?? '');

  const [selectedItem, setSelectedItem] = useState<any>({});
  const findDictTypeById = useQuery(
    ['findDictTypeById'],
    () => SysService.findDictTypeById(dictId.current),
    { enabled: false },
  );

  // useEffect(() => {
  //   dictId.current = findDict.data?.data[0]?.dictId ?? '';
  //   findDictTypeById.refetch();
  // }, [findDict.data]);

  const findDictDataById = useQuery(['findDictDataById'], () =>
    SysService.findDictDataById(pageParams.tableDictData),
  );
  const selectedNameHandle = (item) => {
    if (selectedItem.dictId == item.dictId) {
      setSelectedItem({});
    } else {
      setSelectedItem(item);
      dictId.current = item.dictId;
      findDictTypeById.refetch().then((result) => {
        if (result.data.success) {
          setPageParams((prevState) => ({
            ...prevState,
            tableDictData: {
              ...prevState.tableDictData,
              dictType: result.data?.data.dictType,
            },
          }));
        } else {
          messageApi.error(result.data.errorMessage);
        }
      });
    }
  };

  useEffect(() => {
    findDictDataById.refetch();
  }, [pageParams.tableDictData]);

  useEffect(() => {
    findDict.refetch();
  }, [pageParams.tablePage]);

  const columns = [
    {
      title: '名称',
      dataIndex: 'dictLabel',
    },
    {
      title: '值',
      dataIndex: 'dictValue',
    },
    {
      title: '排序',
      dataIndex: 'dictSort',
    },

    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <ProTag color={status == BasicStatus.DISABLE ? 'error' : 'success'}>
          {status == BasicStatus.DISABLE ? '禁用' : '启用'}
        </ProTag>
      ),
    },

    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-end text-gray">
          <IconButton onClick={() => onEdit(record)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          {/* <Popconfirm */}
          {/*   title="删除菜单？" */}
          {/*   okText="确定" */}
          {/*   cancelText="取消" */}
          {/*   placement="left" */}
          {/*   onConfirm={() => deleteHandle(record)} */}
          {/* > */}
          {/*   <IconButton> */}
          {/*     <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" /> */}
          {/*   </IconButton> */}
          {/* </Popconfirm> */}
        </div>
      ),
    },
  ];
  const searchHandle = (value) => {
    setPageParams((prevState) => ({
      ...prevState,
      tablePage: {
        ...prevState.tablePage,
        dictName: value,
      },
    }));
  };

  const onEdit = (formValue) => {
    setPageData((prevState) => ({
      ...prevState,
      formValue,
      show: true,
      title: '编辑',
    }));
  };

  const onCreate = () => {
    setPageData((prevState) => ({
      ...prevState,
      formValue: { ...defaultDictValue, dictType: pageParams.tableDictData?.dictType || '' },
      show: true,
      title: '新增',
    }));
  };

  const updateDictType = useMutation(SysService.updateDictType);
  const createDictType = useMutation(SysService.createDictType);

  const initdictTypeFormValue = {
    dictName: null,
    dictType: null,
    status: null,
    remark: null,
  };

  const [dictTypePage, setDictTypePage] = useState({
    title: '新增',
    show: false,
    formValue: { ...initdictTypeFormValue },
    onOk: (title, data) => {
      if (title == '新增') {
        createDictType.mutate(
          { ...data },
          {
            onSuccess: (resp) => {
              if (resp.success) {
                findDict.refetch();
                setDictTypePage((prev) => ({ ...prev, show: false }));
                messageApi.success('创建字典成功！');
              } else {
                messageApi.error(resp.errorMessage);
              }
            },
          },
        );
      } else {
        updateDictType.mutate(data, {
          onSuccess: (resp) => {
            console.log(data, resp);
            if (resp.success) {
              findDict.refetch();
              setDictTypePage((prev) => ({ ...prev, show: false }));
              messageApi.success('更新字典成功！');
            } else {
              messageApi.error(resp.errorMessage);
            }
          },
        });
      }
    },
    onCancel: () => {
      setDictTypePage((prevState) => ({
        ...prevState,
        show: false,
      }));
    },
  });
  const onCreateType = () => {
    setDictTypePage((prevState) => ({
      ...prevState,
      formValue: initdictTypeFormValue,
      title: '新增',
      show: true,
    }));
  };

  const onTypeEdit = (formValue) => {
    setDictTypePage((prevState) => ({
      ...prevState,
      formValue: formValue,
      title: '编辑',
      show: true,
    }));
  };

  const listPaginationChangeHandle = (current, pageSize) => {
    console.log(current, pageSize);
    setPageParams((prevState) => ({
      ...prevState,
      tablePage: {
        ...prevState.tablePage,
        current: current,
        pageSize: pageSize,
      },
    }));
  };

  const tablePageChangeHandle = (current, pageSize) => {
    setPageParams((prevState) => ({
      ...prevState,
      tableDictData: {
        ...prevState.tableDictData,
        current,
        pageSize,
      },
    }));
  };
  return (
    <div>
      {contextHolder}
      <Row>
        <Col span={9}>
          <Card
            title={'字典类型'}
            extra={
              <Space>
                <Search allowClear onSearch={searchHandle} />
                <Button type={'primary'} onClick={onCreateType}>
                  新增
                </Button>
              </Space>
            }
          >
            <Spin spinning={findDict.isLoading}>
              <List
                pagination={{ total: findDict.data?.total, onChange: listPaginationChangeHandle }}
                rowKey={(record) => record.dictId}
                dataSource={findDict.data?.data || []}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item className={'!border-none'}>
                      <Space>
                        <Button
                          type={item.dictId == selectedItem!.dictId ? 'primary' : 'text'}
                          onClick={() => selectedNameHandle(item)}
                        >
                          {item.dictName}
                        </Button>
                        <ProTag color={item.status == BasicStatus.ENABLE ? 'green' : 'red'}>
                          {item.status == BasicStatus.ENABLE ? '正常' : '禁用'}
                        </ProTag>
                      </Space>
                      <div>{item.dictType}</div>
                    </List.Item>
                    <List.Item>
                      <IconButton onClick={() => onTypeEdit(item)}>
                        <Iconify icon="solar:pen-bold-duotone" size={18} />
                      </IconButton>
                    </List.Item>
                  </List.Item>
                )}
              ></List>
            </Spin>
            <Dict_type_drawer {...dictTypePage} />
          </Card>
        </Col>
        <Col span={15} style={{ paddingLeft: '10px' }}>
          <Spin spinning={findDictDataById.isLoading}>
            <Card
              title={'字典数据'}
              extra={
                <>
                  <Button type={'primary'} onClick={onCreate}>
                    新增
                  </Button>
                </>
              }
            >
              <Table
                pagination={{
                  total: findDictDataById.data?.total,
                  current: pageParams.tableDictData?.current,
                  pageSize: pageParams.tableDictData.pageSize,
                  onChange: tablePageChangeHandle,
                }}
                rowKey={(record) => String(record.dictCode)}
                columns={columns}
                dataSource={findDictDataById.data?.data || []}
              />
            </Card>
          </Spin>

          <Dict_drawer {...pageData} />
        </Col>
      </Row>
    </div>
  );
};

export default Index;
