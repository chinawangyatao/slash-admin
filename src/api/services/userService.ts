import apiClient from '../apiClient';

import { Captcha, UserInfo, UserToken } from '#/entity';

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

export enum UserApi {
  SignIn = '/login',
  SignUp = '/auth/signup',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  UserID = '/user',
  Captcha = '/captcha',
  User = '/getinfo',
  MenuList = '/menurole',
}

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data });
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.UserID}/${id}` });
const findCaptcha = () => apiClient.get<Captcha>({ url: UserApi.Captcha });
const findUserInfo = () => apiClient.get({ url: UserApi.User });

const findMenu = () => apiClient.get({ url: UserApi.MenuList });

export default {
  signin,
  signup,
  findById,
  logout,
  findCaptcha,
  findUserInfo,
  findMenu,
};
