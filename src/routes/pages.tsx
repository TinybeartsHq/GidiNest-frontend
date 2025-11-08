import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

export const SignInPage = lazy(() => import('src/pages/auth/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/auth/sign-up'));
export const ForgotPasswordPage = lazy(() => import('src/pages/auth/forgot-password'));
export const EmailActivationPage = lazy(() => import('src/pages/auth/email-activation'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const Logout = lazy(() => import('src/pages/auth/logout'));


export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const CommunityPage = lazy(() => import('src/pages/community'));
export const CommunityPostDetailPage = lazy(() => import('src/pages/communitydetail'));

export const SavingsPage = lazy(() => import('src/pages/savings'));


export const TransactionsView = lazy(() => import('src/pages/transactions'));
export const UserProfileView = lazy(() => import('src/pages/profile'));
export const TipsView = lazy(() => import('src/pages/tips'));
export const PrivacyPolicyPage = lazy(() => import('src/pages/privacy-policy'));
export const TermsConditionsPage = lazy(() => import('src/pages/terms-conditions'));


const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'savings', element: <SavingsPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'community/:id', element: <CommunityPostDetailPage /> },
      { path: 'transactions', element: <TransactionsView /> }, 
      { path: 'profile', element: <UserProfileView /> },
      { path: 'tips', element: <TipsView /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'terms-and-conditions', element: <TermsConditionsPage /> },
    ],
  }, 
  {
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
    index: true,
  },

  {
    path: 'logout',
    element: (
      <AuthLayout>
        <Logout />
      </AuthLayout>
    ),
  },
  {
    path: 'register',
    element: (
      <AuthLayout>
        <SignUpPage />
      </AuthLayout>
    ),
  },
  {
    path: 'forgot-password',
    element: (
      <AuthLayout>
        <ForgotPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: 'email/activation/:id',
    element: (
      <AuthLayout>
        <EmailActivationPage />
      </AuthLayout>
    ),
  },
  
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
