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
export interface IGetSysUser extends IPageSize {
  [key: string]: any;
}

// 创建菜单
/**
 * Menu
 * 菜单
 */
export type MenuListItem = {
  children?: MenuListItem[] | undefined;
  component?: string;
  createdAt?: Date;
  dataScope: string;
  icon?: string;
  isFrame?: string;
  visible?: boolean;
  menuId?: number;
  menuName?: string;
  menuType?: string;
  parentId?: number;
  path?: string;
  paths?: string;
  permission?: string;
  sort?: number;
  sysApi?: any[];
  apis?: number[];
  title?: string;
};
