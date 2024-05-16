import { Badge, Descriptions, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import sysUserService from '@/api/services/sysService.ts';
import React, { useEffect, useState } from 'react';
import { fHour } from '@/utils/format-day.ts';

export default function UserDetail({ userId, dictSex, dictPost, dictRole, deptTreeData }) {
  const [sysUserItem, setSysUserItem] = useState<IDescriptions[]>();

  const findSysUserById = useQuery(['findSysUserById', userId], () =>
    sysUserService.findSysUserById(userId),
  );

  const findDictSex = (value: any) => {
    const { data } = dictSex;
    const sex = data.find((i) => (i.value = value));
    return sex.label;
  };

  const findDictPost = (value: any) => {
    const { data } = dictPost;
    const post = data.find((i) => (i.value = value));
    return post.label;
  };

  const findDictRole = (value: any) => {
    const { data } = dictRole;
    const Role = data.find((i) => (i.value = value));
    return Role.label;
  };

  function findLabelByValue(data, targetValue) {
    for (let item of data) {
      if (item.value === targetValue) {
        return item.label;
      }
      if (item.children) {
        let label = findLabelByValue(item.children, targetValue); // 注意这里的调用方式
        if (label !== null) {
          return label;
        }
      }
    }
    return null;
  }

  useEffect(() => {
    const userData = findSysUserById.data?.data; // 加入了判空处理
    if (userData) {
      // 只有在数据存在时才进行处理
      const {
        username,
        nickName,
        phone,
        roleId,
        sex,
        email,
        deptId,
        postId,
        remark,
        status,
        createdAt,
      } = userData;

      setSysUserItem([
        {
          key: '1',
          label: '用户名',
          children: username,
        },
        {
          key: '2',
          label: '昵称',
          children: nickName,
        },
        {
          key: '3',
          label: '手机号',
          children: phone,
        },
        {
          key: '4',
          label: '角色',
          children: findDictRole(roleId),
        },
        {
          key: '5',
          label: '性别',
          children: findDictSex(sex),
        },
        {
          key: '6',
          label: '电子邮箱',
          children: email,
        },
        {
          key: '7',
          label: '部门',
          children: findLabelByValue(deptTreeData.data, deptId),
        },
        {
          key: '8',
          label: '职位',
          children: findDictPost(postId),
        },
        {
          key: '9',
          label: '状态',
          children: (
            <Badge
              status={status == 1 ? 'error' : 'success'}
              text={status == 1 ? '停用' : '启用'}
            />
          ),
        },
        {
          key: '10',
          label: '创建时间',
          children: fHour(createdAt),
        },
        {
          key: '11',
          label: '备注',
          children: remark,
        },
      ]);
    }
  }, [findSysUserById.data, userId]);

  return (
    <Spin spinning={findSysUserById.isLoading}>
      <Descriptions column={1} bordered items={sysUserItem} />
    </Spin>
  );
}

export interface IDescriptions {
  key: string | number;
  label: string;
  children: string | React.ReactNode;
}
