// import { useCallback, useEffect } from 'react';
// import { ErrorBoundary } from 'react-error-boundary';
//
// import PageError from '@/pages/sys/error/PageError';
// import { useUserToken } from '@/store/userStore';
//
// import { useRouter } from '../hooks';
//
// type Props = {
//   children: React.ReactNode;
// };
// export default function AuthGuard({ children }: Props) {
//   const router = useRouter();
//   const { accessToken } = useUserToken();
//
//   const check = useCallback(() => {
//     if (!accessToken) {
//       router.replace('/login');
//     }
//   }, [router, accessToken]);
//
//   useEffect(() => {
//     check();
//   }, [check]);
//
//   return <ErrorBoundary FallbackComponent={PageError}>{children}</ErrorBoundary>;

// }

import { useCallback, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import PageError from '@/pages/sys/error/PageError';
import { useUserToken } from '@/store/userStore';

import { useRouter } from '../hooks';

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const { accessToken } = useUserToken();

  const check = useCallback(() => {
    if (!accessToken) {
      // 注意：router.replace 是一个副作用，不应该在渲染期间调用
      router.replace('/login');
    }
  }, [router, accessToken]);

  useEffect(() => {
    check();
  }, [check]);

  // 确保 ErrorBoundary 不会在渲染期间更新状态
  return <ErrorBoundary FallbackComponent={PageError}>{children}</ErrorBoundary>;
}
