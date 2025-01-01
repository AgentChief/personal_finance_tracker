import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from '@/pages/dashboard';
import { Accounts } from '@/pages/accounts';
import { Transactions } from '@/pages/transactions';
import { Categories } from '@/pages/categories';
import { Budgets } from '@/pages/budgets';
import { Analysis } from '@/pages/analysis';
import { AuthCallback } from './auth-callback';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/accounts',
    element: <Accounts />,
  },
  {
    path: '/transactions',
    element: <Transactions />,
  },
  {
    path: '/categories',
    element: <Categories />,
  },
  {
    path: '/budgets',
    element: <Budgets />,
  },
  {
    path: '/analysis',
    element: <Analysis />,
  },
]);