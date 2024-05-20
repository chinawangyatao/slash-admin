import apiClient from '../apiClient';

import { UserInfo, UserToken } from '#/entity';
import {
  ApiResponse,
  deleteParams,
  DeptListItem,
  IDeptTree,
  IGetSysUser,
  ISysUser,
  MenuListItem,
  PostListItem,
} from '#/api.ts';

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
  RoleMenuTreeSelect = '/roleMenuTreeselect/0',
  Dept = '/dept',
  Post = '/post',
  Api = '/sys-api',
  DictType = '/dict/type',
  DictData = '/dict/data',
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
const findMenu = (params?: IGetSysUser) =>
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

// id找角色
const findRoleById = (id: string) => apiClient.get({ url: SySUserApi.Role + `/${id}` });

// 建角色
const createRole = (data: any) => apiClient.post<ApiResponse>({ url: SySUserApi.Role, data });

// 更新角色
const updateRole = (data: any) =>
  apiClient.put<ApiResponse>({ url: SySUserApi.Role + `/${data.roleId}`, data });

// 删除角色
const deleteRole = (options: deleteParams) =>
  apiClient.delete({ url: SySUserApi.Role, data: options });
// 找角色权限树结构
const findRoleMenuTreeSelect = () =>
  apiClient.get<ApiResponse>({ url: SySUserApi.RoleMenuTreeSelect });

// 部门接口
const findDept = () => apiClient.get<ApiResponse>({ url: SySUserApi.Dept });
const findDeptById = (id: string) =>
  apiClient.get<ApiResponse>({ url: SySUserApi.Dept + `/${id}` });
const creatDept = (data: DeptListItem) =>
  apiClient.post<ApiResponse>({ url: SySUserApi.Dept, data });
const updateDept = (data: DeptListItem) =>
  apiClient.put<ApiResponse>({ url: SySUserApi.Dept + `/${data.deptId}`, data });
const deleteDept = (data: deleteParams) =>
  apiClient.delete<ApiResponse>({ url: SySUserApi.Dept, data });

// 职位
const findPost = () => apiClient.get<ApiResponse>({ url: SySUserApi.Post });
const findPostById = (id: string) =>
  apiClient.get<ApiResponse>({ url: SySUserApi.Post + `/${id}` });
const creatPost = (data: PostListItem) =>
  apiClient.post<ApiResponse>({ url: SySUserApi.Post, data });
const updatePost = (data: PostListItem) =>
  apiClient.put<ApiResponse>({ url: SySUserApi.Post + `/${data.postId}`, data });
const deletePost = (data: deleteParams) =>
  apiClient.delete<ApiResponse>({ url: SySUserApi.Post, data });

// 接口管理
const findApi = (data) =>
  apiClient.get<ApiResponse>({
    url: SySUserApi.Api + `?current=${data.current}&pageSize=${data.pageSize}`,
  });
const updataApi = (data) =>
  apiClient.put<ApiResponse>({
    url: SySUserApi.Api + `/${data.id}`,
  });

// 字典管理
const findDict = (data: IGetSysUser) =>
  apiClient.get<ApiResponse>({
    url:
      SySUserApi.DictType +
      `?current=${data.current}&pageSize=${data.pageSize}${
        data.dictName ? '&dictName=' + data.dictName : ''
      }`,
  });

const findDictTypeById = (id: string) =>
  apiClient.get<ApiResponse>({ url: SySUserApi.DictType + `/${id}` });

const updateDictType = (data) =>
  apiClient.put({ url: SySUserApi.DictType + `/${data.dictId}`, data });

const createDictType = (data) => apiClient.post({ url: SySUserApi.DictType, data });

const findDictDataById = (data: IGetSysUser) =>
  apiClient.get<ApiResponse>({
    url:
      SySUserApi.DictData +
      `?current=${data.current}&pageSize=${data.pageSize}&dictType=${data.dictType}`,
  });

const updateDictData = (data: any) =>
  apiClient.put<ApiResponse>({
    url: SySUserApi.DictData + `/${data.dictCode}`,
    data,
  });

const createDictData = (data: any) =>
  apiClient.post<ApiResponse>({
    url: SySUserApi.DictData,
    data,
  });

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
  findRoleById,
  createRole,
  deleteRole,
  findRoleMenuTreeSelect,
  updateRole,
  findDept,
  findDeptById,
  creatDept,
  updateDept,
  deleteDept,
  findPost,
  findPostById,
  creatPost,
  updatePost,
  deletePost,
  findApi,
  updataApi,
  findDict,
  findDictTypeById,
  findDictDataById,
  updateDictData,
  createDictData,
  updateDictType,
  createDictType,
};
