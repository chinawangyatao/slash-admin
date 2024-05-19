import { BasicStatus, PermissionType } from './enum';

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
  currentAuthority?: string;
}
export interface UserPermission {
  permission?: string;
}

export interface PermissionsList {
  menuId?: number;
  title?: string;
  permission?: string;
  parentId?: number;
  noCache?: boolean;
  Breadcrumb?: string;
  sort?: number;
  visible: boolean;
  isFrame?: string | boolean; // 类型待确定，暂时保留为字符串
  Redirect?: string;
  menuName: string;
  name: string;
  icon: string;
  path: string;
  menuType: 'C' | 'M' | 'F'; // 可能的值为 'C', 'M', 'F'
  component: string;
  hideInMenu: boolean;
  disabled: boolean;
  hideTab: boolean;
  newFeature: boolean;
  children: PermissionsList[];
}

export interface UserInfo {
  userId: string;
  id: string;
  email: string;
  username: string;
  password?: string;
  avatar?: string;
  role?: Role;
  status?: BasicStatus;
  permissions?: Permission[];
}

export interface Organization {
  id: string;
  name: string;
  status: 'enable' | 'disable';
  desc?: string;
  order?: number;
  children?: Organization[];
}

export interface Permission {
  id: string;
  parentId: string;
  menuId?: number;
  menuName?: string;
  name: string;
  label: string;
  menuType: PermissionType;
  route: string;
  status?: BasicStatus;
  order?: number;
  icon?: string;
  component?: string;
  hide?: boolean;
  hideTab?: boolean;
  frameSrc?: string;
  newFeature?: boolean;
  [key: string]: any;
  children?: Permission[];
}

interface SysApi {
  bus: string;
  createBy: number;
  createdAt: string;
  func: string;
  handle: string;
  id: number;
  isHistory: number;
  method: string;
  name: string;
  path: string;
  project: string;
  type: string;
  updateBy: number;
  updatedAt: string;
}

interface SysMenu {
  apis: number[];
  breadcrumb: string;
  children: string[];
  component: string;
  createBy: number;
  createdAt: string;
  dataScope: string;
  icon: string;
  isFrame: string;
  is_select: boolean;
  menuId: number;
  menuName: string;
  menuType: string;
  noCache: boolean;
  params: string;
  parentId: number;
  path: string;
  paths: string;
  permission: string;
  roleId: number;
  sort: number;
  sysApi: SysApi[];
  title: string;
  updateBy: number;
  updatedAt: string;
  visible: boolean;
}

interface SysDept {
  children: string[];
  createBy: number;
  createdAt: string;
  dataScope: string;
  deptId: number;
  deptName: string;
  deptPath: string;
  email: string;
  leader: string;
  params: string;
  parentId: number;
  phone: string;
  sort: number;
  status: number;
  updateBy: number;
  updatedAt: string;
}

export interface Role {
  admin: boolean | null;
  createBy: number | null;
  dataScope: string | null;
  deptIds: number[] | null;
  flag: string | null;
  menuIds: number[] | null;
  remark: string | null;
  roleId: number | null;
  roleKey: string | null;
  roleName: string | null;
  roleSort: number | null;
  status: string | null;
  sysDept: SysDept[] | null;
  sysMenu: SysMenu[] | null;
  updateBy: number | null;
}

// 验证码
export interface Captcha {
  errorCode: 'string';
  errorMessage: 'string';
  host: 'string';
  showType: 0;
  status: 'string';
  success: true;
  traceId: 'string';
  data: 'string';
  id: 'string';
  msg: 'string';
}

export type Order = 'desc' | 'asc' | null;

export interface IPageSize {
  current: number;
  pageSize: number;
  createdAtOrder?: Order;
}
