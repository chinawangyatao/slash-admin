import {
  QueryObserverLoadingErrorResult,
  QueryObserverLoadingResult,
  QueryObserverRefetchErrorResult,
  QueryObserverSuccessResult,
  useMutation,
} from '@tanstack/react-query';
import { App } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';

import userService, { SignInReq } from '@/api/services/userService';
import { getItem, removeItem, setItem } from '@/utils/storage';

import { PermissionsList, UserInfo, UserToken } from '#/entity';
import { StorageEnum } from '#/enum';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: UserToken;
  permissionsList?: PermissionsList[];
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setUserInfo: (
      userInfo:
        | QueryObserverRefetchErrorResult<any, unknown>
        | QueryObserverSuccessResult<any, unknown>
        | QueryObserverLoadingErrorResult<any, unknown>
        | QueryObserverLoadingResult<any, unknown>,
    ) => void;
    setUserToken: (token: UserToken) => void;
    clearUserInfoAndToken: () => void;
    setPermissionsList: (permissionsList: PermissionsList[]) => void;
  };
};

const useUserStore = create<UserStore>((set) => ({
  userInfo: getItem<UserInfo>(StorageEnum.User) || {},
  userToken: getItem<UserToken>(StorageEnum.Token) || {},
  permissionsList: [],
  actions: {
    setUserInfo: (userInfo: any) => {
      set({ userInfo });
      setItem(StorageEnum.User, userInfo);
    },
    setUserToken: (userToken) => {
      set({ userToken });
      setItem(StorageEnum.Token, userToken);
    },
    clearUserInfoAndToken() {
      set({ userInfo: {}, userToken: {} });
      removeItem(StorageEnum.User);
      removeItem(StorageEnum.Token);
    },
    setPermissionsList: (permissionsList: PermissionsList[]) => {
      set({ permissionsList });
    },
  },
}));

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.permissionsList);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
  const { t } = useTranslation();
  const navigatge = useNavigate();
  const { notification, message } = App.useApp();
  const { setUserToken, setUserInfo, setPermissionsList } = useUserActions();

  const signInMutation = useMutation(userService.signin);

  const signIn = async (params: SignInReq) => {
    try {
      const res: any = await signInMutation.mutateAsync(params);
      if (!res.success) throw Error(res.errorMessage);

      const { token, currentAuthority } = res;
      setUserToken({ accessToken: token, currentAuthority });

      const { data, success } = await userService.findUserInfo();
      if (!success) throw Error('get Userinfo err!');
      setUserInfo(data);

      const menuList = await userService.findMenu();
      if (!menuList.success) throw Error('find Menu error!!');

      setPermissionsList(menuList.data);
      navigatge(HOMEPAGE, { replace: true });

      notification.success({
        message: t('sys.login.loginSuccessTitle'),
        description: `${t('sys.login.loginSuccessDesc')}: ${params.username}`,
        duration: 3,
      });
    } catch (err) {
      message.warning({
        content: err.message,
        duration: 3,
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(signIn, []);
};
