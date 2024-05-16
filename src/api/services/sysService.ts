import apiClient from '../apiClient';

import { UserInfo, UserToken } from '#/entity';
import { ApiResponse, IDeptTree, IGetSysUser, ISysUser, MenuListItem } from '#/api.ts';

export interface SignInReq {
  username: string;
  password: string;
  code: string;
  uuid?: string;
  type: 'account';
}

export interface SignUpReq extends SignInReq {
  email: string;
}
export type SignInRes = UserToken & { user: UserInfo };

export enum SySUserApi {
  DeptTree = '/dept-tree-option',
  SysUser = '/sys-user',
  SysUserStatus = '/user/status',
  Menu = '/menu',
  Role = '/role',
}

const findTreeData = () => apiClient.get<ApiResponse<IDeptTree>>({ url: SySUserApi.DeptTree });

const createSysUser = (data: ISysUser) =>
  apiClient.post<ApiResponse>({ url: SySUserApi.SysUser, data: data });

const updateSysUser = (data: ISysUser) => apiClient.put({ url: SySUserApi.SysUser, data });
const findSysUser = (params: IGetSysUser) =>
  apiClient.get<ApiResponse>({ url: SySUserApi.SysUser, params: params });

const findSysUserById = (id: string | null | undefined) =>
  apiClient.get<ApiResponse>({ url: SySUserApi.SysUser + `/${id}` });

const deleteSysUser = (options: any) =>
  apiClient.delete({ url: SySUserApi.SysUser, data: options });

const updateSysUserStatus = (data: ISysUser) =>
  apiClient.put({ url: SySUserApi.SysUserStatus, data });

// 找菜单
const findMenu = (params: IGetSysUser) =>
  apiClient.get<ApiResponse>({ url: SySUserApi.Menu, params });

// 删菜单
const deleteMenu = (option: any) => apiClient.delete({ url: SySUserApi.Menu, data: option });

// 建菜单
const createMenu = (data: MenuListItem) => apiClient.post({ url: SySUserApi.Menu, data });

// 更新菜单
const updateMenu = (data: MenuListItem) =>
  apiClient.put({ url: SySUserApi.Menu + `/${data.menuId}`, data });

// 找角色
const findRole = (params: React.MutableRefObject<IGetSysUser>) =>
  apiClient.get({ url: SySUserApi.Role, params });

export default {
  findTreeData,
  updateSysUser,
  findSysUser,
  findSysUserById,
  createSysUser,
  deleteSysUser,
  updateSysUserStatus,
  findMenu,
  deleteMenu,
  createMenu,
  updateMenu,
  findRole,
};
