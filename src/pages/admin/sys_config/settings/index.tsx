import React, { lazy, Suspense, useState } from 'react';
import Card from '@/components/card';
import { Col, Row, Tabs, Typography } from 'antd';

const tabsItem = [
  {
    label: '基本设置',
    key: '1',
    component: lazy(() => import('@/pages/admin/sys_config/components/basic_settings/index.tsx')),
  },
  {
    label: '安全设置',
    key: '2',
    component: lazy(
      () => import('@/pages/admin/sys_config/components/security_settings/index.tsx'),
    ),
  },
  {
    label: '对象存储',
    key: '3',
    component: lazy(() => import('@/pages/admin/sys_config/components/object_storage/index.tsx')),
  },
  {
    label: '提醒设置',
    key: '4',
    component: lazy(
      () => import('@/pages/admin/sys_config/components/reminder_settings/index.tsx'),
    ),
  },
  {
    label: '扩展配置',
    key: '5',
    component: lazy(
      () => import('@/pages/admin/sys_config/components/extended_configuration/index.tsx'),
    ),
  },
];

const Index = () => {
  const [selectTabKey, setSelectTabKey] = useState('1');

  const tabsChangeHandle = (key) => {
    setSelectTabKey(key);
  };

  const renderTabComponent = (key) => {
    const tab = tabsItem.find((item) => item.key === key);
    if (tab) {
      const Component = tab.component;
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      );
    }
    return null;
  };

  return (
    <>
      <Card>
        <Row className="w-full">
          <Col>
            <Tabs onChange={tabsChangeHandle} tabPosition="left">
              {tabsItem.map((item) => (
                <Tabs.TabPane tab={item.label} key={item.key} />
              ))}
            </Tabs>
          </Col>
          <Col span={20}>
            <Typography.Title level={4} className={'relative'}>
              {tabsItem.find((item) => item.key === selectTabKey)?.label}
            </Typography.Title>
            {renderTabComponent(selectTabKey)}
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Index;
