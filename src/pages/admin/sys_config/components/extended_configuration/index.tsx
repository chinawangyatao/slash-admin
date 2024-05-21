import React, { useState } from 'react';
import type { TableProps as RcTableProps } from 'rc-table';
import AddTable from '@/components/addTable';
import { Form, Input, Popconfirm, Space, Switch } from 'antd';
import { IconButton, Iconify } from '@/components/icon';

export type DataType = { name: string; display: boolean; key: string; value: string };

export interface IPageData {
  tableData: RcTableProps<DataType>['data'];
}

const Index = () => {
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Form.Item>
          <Input value={name} />
        </Form.Item>
      ),
    },
    {
      title: '前台显示',
      dataIndex: 'display',
      key: 'display',
      render: () => (
        <>
          <Switch checkedChildren={'是'} unCheckedChildren={'否'} />
        </>
      ),
    },
    {
      title: '键名',
      dataIndex: 'key',
      key: 'key',
      render: () => (
        <>
          <Input />
        </>
      ),
    },
    {
      title: '键值',
      dataIndex: 'value',
      key: 'value',
      render: () => (
        <>
          <Input />
        </>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <>
          <Space>
            <IconButton onClick={() => onSave(record)}>
              <Iconify icon="ion:save" size={18} />
            </IconButton>
            <IconButton onClick={() => onEdit(record)}>
              <Iconify icon="solar:pen-bold-duotone" size={18} />
            </IconButton>
            <Popconfirm
              title="删除菜单？"
              okText="确定"
              cancelText="取消"
              placement="left"
              onConfirm={() => onDelete(record)}
            >
              <IconButton>
                <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
              </IconButton>
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];
  const initTableData: DataType = { name: '', display: true, key: '', value: '' };
  const [pageData, setPageData] = useState<IPageData>({
    tableData: [initTableData],
  });

  const onSave = (record) => {};

  const onEdit = (record) => {};

  const onDelete = (record) => {};

  const onAddHandle = () => {
    console.log('onAddHandle');
    // setPageData((prevState) => {
    //   if (prevState.tableData?.length) {
    //     const tableData = prevState.tableData;
    //     tableData.push({ ...initTableData });
    //     return {
    //       ...prevState,
    //       tableData,
    //     };
    //   }
    // });
  };
  return (
    <div>
      <AddTable
        columns={columns}
        dataSource={pageData.tableData}
        rowKeyName={'key'}
        onAddHandle={onAddHandle}
      />
    </div>
  );
};

export default Index;
