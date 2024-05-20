import { IPageSize } from '#/entity.ts';

export type deleteParams = {
  ids: number[];
};
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
  total: number;
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

/**
 * Dept
 * 部门
 */
export interface DeptListItem {
  deptId: number | null;
  parentId: number | null;
  deptPath: string | null;
  deptName: string | null;
  sort: number | null;
  leader: string | null;
  phone: string | null;
  email: string | null;
  status: any | null;
  createBy: number | null;
  updateBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  dataScope: string | null;
  params: string | null;
  children: DeptListItem[] | undefined | null;
}

/**
 * Post
 * 岗位
 */
export interface PostListItem {
  postId?: number | null;
  postName: string | null;
  postCode: string;
  sort: number | null;
  status: any | null;
  remark: string | null;
  dataScope: string | null;
  params: string | null;
  createBy?: number | null;
  updateBy?: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

/**
 * SysApi
 * 接口
 */
export interface SysApiItem {
  id?: number | null; // 编码
  handle?: string | null; // handle
  name: string | null; // 名称
  path: string | null; // 地址
  method: string | null; // 请求类型
  type: string | null; // 接口类型
  bus: string | null; // 业务模块
  project: string | null; // 项目名称
  isHistory?: number | null; // 是否历史接口
  func?: string | null; // func
  createBy?: number; // 创建人
  updateBy?: number; // 修改人
  createdAt?: Date; // 创建时间
  updatedAt?: Date; // 修改时间
  deletedAt?: Date; // 删除时间
}
