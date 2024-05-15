import { isEmpty } from 'ramda';
import { Suspense, lazy, useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Iconify } from '@/components/icon';
import { CircleLoading } from '@/components/loading';
import { useUserPermission } from '@/store/userStore';
import ProTag from '@/theme/antd/components/tag';

import { PermissionsList } from '#/entity';
import { PermissionType } from '#/enum';
import { AppRouteObject } from '#/router';
// @ts-ignore

// 使用 import.meta.glob 获取所有路由组件
const entryPath = '/src/pages';
const pages = import.meta.glob('/src/pages/**/*.tsx');
export const pagesSelect = Object.entries(pages).map(([path]) => {
  const pagePath = path.replace(entryPath, '');
  return {
    label: pagePath,
    value: pagePath,
  };
});

// 构建绝对路径的函数
function resolveComponent(path: string) {
  console.log(path);
  console.log(pages);
  return pages[`${entryPath}${path}.tsx`];
}

/**
 * return routes about permission
 */
export function usePermissionRoutes() {
  // 切换回静态路由
  // return useMemo(() => {
  //   return getRoutesFromModules();
  // }, []);

  const permissions = useUserPermission();
  return useMemo(() => {
    // const flattenedPermissions = flattenTrees(permissions!);

    const permissionRoutes = transformPermissionToMenuRoutes(permissions || []);
    console.log(permissionRoutes);
    return [...permissionRoutes];
  }, [permissions]);
}

/**
 * 将权限 [] 转换为AppRouteObject[]
 * @param permissions
 */
// @ts-ignore
function transformPermissionToMenuRoutes(permissions: PermissionsList[]) {
  return permissions.map((permission) => {
    const {
      icon,
      menuName,
      menuType,
      component,
      isFrame,
      path,
      sort,
      visible,
      disabled,
      hideTab,
      newFeature,
      parentId,
      children = [],
    } = permission;

    const appRoute: AppRouteObject = {
      path,
      meta: {
        label: menuName,
        key: component === '' ? path : component,
        hideMenu: visible,
        hideTab,
        disabled,
        menuName,
      },
    };

    if (sort) appRoute.order = sort;
    if (icon) appRoute.meta!.icon = icon;
    if (isFrame) {
      // @ts-ignore
      appRoute.meta!.frameSrc = isFrame;
    }

    if (newFeature) {
      appRoute.meta!.suffix = (
        <ProTag color="cyan" icon={<Iconify icon="solar:bell-bing-bold-duotone" size={14} />}>
          NEW
        </ProTag>
      );
    }

    if (menuType === PermissionType.CATALOGUE) {
      appRoute.meta!.hideTab = true;
      if (!parentId) {
        appRoute.element = (
          <Suspense fallback={<CircleLoading />}>
            <Outlet />
          </Suspense>
        );
      }
      appRoute.children = transformPermissionToMenuRoutes(children);
      //
      if (!isEmpty(children)) {
        appRoute.children.unshift({
          index: true,
          element: <Navigate to={children[0].path} replace />,
        });
      }
    } else if (menuType === PermissionType.MENU) {
      const Element = lazy(resolveComponent(component!) as any);
      console.log(resolveComponent(component!));
      if (isFrame) {
        appRoute.element = <Element src={isFrame} />;
      } else {
        appRoute.element = (
          <Suspense fallback={<CircleLoading />}>
            <Element />
          </Suspense>
        );
      }
    }

    return appRoute;
  });
}

/**
 * 从根权限路由拼接到当前权限路由
 * @param {Permission} permission - current permission
 * @param {Permission[]} flattenedPermissions - flattened permission array
 * @param {string} route - parent permission route
 * @returns {string} - The complete route after splicing
 */
// function getCompleteRoute(permission: Permission, flattenedPermissions: Permission[], route = '') {
//   const currentRoute = route ? `/${permission.route}${route}` : `/${permission.route}`;
//
//   if (permission.parentId) {
//     const parentPermission = flattenedPermissions.find((p) => p.id === permission.parentId)!;
//     return getCompleteRoute(parentPermission, flattenedPermissions, currentRoute);
//   }
//
//   return currentRoute;
// }
