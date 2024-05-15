import apiClient from '../apiClient';

import { ApiResponse, IDeptTree, IGetSysUser, ISysUser } from '#/api.ts';
import { UserInfo, UserToken } from '#/entity';

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
}

const findTreeData = () => apiClient.get<ApiResponse<IDeptTree>>({ url: SySUserApi.DeptTree });

const updateSysUser = (data: ISysUser) =>
  apiClient.post<ApiResponse>({ url: SySUserApi.SysUser, data });

const findSysUser = (params: React.MutableRefObject<IGetSysUser>) =>
  apiClient.get<ApiResponse>({ url: SySUserApi.SysUser, params });

const findSysUserById = (id: string | null) =>
  apiClient.get<ApiResponse>({ url: `${SySUserApi.SysUser}/${id}` });

export default {
  findTreeData,
  updateSysUser,
  findSysUser,
  findSysUserById,
};
