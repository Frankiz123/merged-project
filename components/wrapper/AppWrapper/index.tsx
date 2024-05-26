import React, { useCallback, useEffect, useState } from 'react';

import { NextComponentType, NextPageContext } from 'next';

import { useRouter } from 'next/router';
import { useAuth } from '@context/AuthContext';
import { AUTH_ROUTES, PROTECTED_ROUTES } from '@utils/routes';
import { ProtectedContextProvider } from '@context/ProtectedContext';
import { AppInitialProps } from 'next/app';
import LoaderComponent from '@components/Loader';

interface IAppWrapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: AppInitialProps;
}

const AppWrapper: React.FC<IAppWrapper> = ({ Component, pageProps }) => {
  const { isLoading, user, userPlan, userActivePlan } = useAuth();
  const router = useRouter();
  const { pathname } = router;

  const [isRouteCheck, setIsRouteCheck] = useState<boolean>(true);

  const isLoggedIn = Boolean(user && user?.id);

  const getKeyByValue = (object: object, value: string): number => {
    return Object.keys(object).findIndex(key => object[key] === value);
  };

  const validateUserRoute = useCallback(() => {
    if (!isLoading) {
      // User is login, and going to auth-routes => redirect to dashboard
      if (isLoggedIn && getKeyByValue(AUTH_ROUTES, pathname) > -1) {
        // User payment plan is not setup, redirect to plan page
        if (!user?.userPlanId || !userPlan || !userActivePlan) {
          void router.replace(PROTECTED_ROUTES.signUpPayment).then(() => {
            setIsRouteCheck(false);
          });
        } else {
          void router.replace(PROTECTED_ROUTES.dashboard).then(() => {
            setIsRouteCheck(false);
          });
        }
      }
      // User is not login, and going to protected-routes => redirect to login
      else if (!isLoggedIn && getKeyByValue(PROTECTED_ROUTES, pathname) > -1) {
        void router.replace(AUTH_ROUTES.login).then(() => {
          setIsRouteCheck(false);
        });
      }
      // User is going to correct rouer, either logged in or not
      else {
        // User payment plan is not setup, redirect to plan page
        if (isLoggedIn && (!user?.userPlanId || !userPlan || !userActivePlan)) {
          void router.replace(PROTECTED_ROUTES.signUpPayment).then(() => {
            setIsRouteCheck(false);
          });
        } else if (isLoggedIn && user?.userPlanId && userPlan && userActivePlan && pathname.includes('signup/payment')) {
          void router.replace(PROTECTED_ROUTES.dashboard).then(() => {
            setIsRouteCheck(false);
          });
        } else {
          setIsRouteCheck(false);
        }
      }
    }
  }, [isLoading, pathname, user, userPlan, userActivePlan]);

  useEffect(() => {
    validateUserRoute();
  }, [isLoading, pathname, user, userPlan, userActivePlan]);

  if (isLoading || isRouteCheck) {
    return <LoaderComponent loading={isRouteCheck} />;
  }

  if (!isLoading && isLoggedIn) {
    return (
      <ProtectedContextProvider>
        <Component {...pageProps} />
      </ProtectedContextProvider>
    );
  }

  return <Component {...pageProps} />;
};

export default AppWrapper;
