import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const CommunityPage = lazy(() => import('src/pages/community'));
export const CommunityPostDetailPage = lazy(() => import('src/pages/communitydetail'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/auth/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/auth/sign-up'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const Logout = lazy(() => import('src/pages/auth/logout'));


export const SavingsPage = lazy(() => import('src/pages/savings'));
export const SingleSavingsGoalView = lazy(() => import('src/pages/savingsdetail'));


export const TransactionsView = lazy(() => import('src/pages/transactions'));
export const UserProfileView = lazy(() => import('src/pages/profile'));
export const TipsView = lazy(() => import('src/pages/tips'));


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
      { path: 'user', element: <UserPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'savings', element: <SavingsPage /> },
      { path: 'savings/:id', element: <SingleSavingsGoalView /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'community/:id', element: <CommunityPostDetailPage /> },
      { path: 'transactions', element: <TransactionsView /> }, 
      { path: 'profile', element: <UserProfileView /> },
      { path: 'tips', element: <TipsView /> },
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
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
