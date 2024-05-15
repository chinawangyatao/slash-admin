import { IPageSize } from '#/entity.ts';

export interface Result<T = any> {
  status: number;
  statusText: string;
  data?: T;
}

// 通用返回接口
export interface ApiResponse<T = any> {
  errorMessage: any;
  status: string;
  success: boolean;
  traceId: string;
  data?: T;
}

//  部门树
export interface IDeptTree {
  label: string;
  value: number;
  children?: IDeptTree[];
}

// 创建更新用户
export interface ISysUser {
  avatar?: string;
  deptId: number;
  email: string;
  nickName: string;
  phone: string;
  postId: number;
  roleId: number;
  sex: string;
  status: string;
  username: string;
}
// 查询
export interface IGetSysUser extends IPageSize {}
