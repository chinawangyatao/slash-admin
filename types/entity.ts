import { BasicStatus, PermissionType } from './enum';

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
  currentAuthority?: string;
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
  name: string;
  label: string;
  type: PermissionType;
  route: string;
  status?: BasicStatus;
  order?: number;
  icon?: string;
  component?: string;
  hide?: boolean;
  hideTab?: boolean;
  frameSrc?: string;
  newFeature?: boolean;
  children?: Permission[];
}

export interface Role {
  id: string;
  name: string;
  label: string;
  status: BasicStatus;
  order?: number;
  desc?: string;
  permission?: Permission[];
}

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
