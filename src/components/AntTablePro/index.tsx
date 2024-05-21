import AntSearchForm from '@/components/AntSearchForm';
import Table from 'antd/es/table';
import { useState } from 'react';

const Index = () => {
  const [antTablePage, setAntTablePage] = useState({
    formColumns: [{}],
    formOptions: {
      labelCol: { span: 5 },
    },
  });
  return (
    <div>
      <div>
        <AntSearchForm
          formColumns={antTablePage.formColumns}
          formOptions={antTablePage.formOptions}
        />
      </div>
      <div>
        <Table />
      </div>
    </div>
  );
};

export default Index;
