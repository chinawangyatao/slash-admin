import Table, { ColumnsType } from 'antd/es/table';
import { AnyObject } from 'antd/es/_util/type';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export interface AddTableIProps<T = any> {
  columns: ColumnsType<AnyObject> | undefined;
  dataSource: T[];
  rowKeyName: string;
  onAddHandle: () => void;
}

const Index = ({ columns, dataSource, rowKeyName, onAddHandle }: AddTableIProps) => {
  return (
    <div>
      <Table
        rowKey={(record) => String(record[rowKeyName])}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
      <Button block type={'dashed'} icon={<PlusOutlined />} onClick={onAddHandle}>
        添加一行数据
      </Button>
    </div>
  );
};

export default Index;
