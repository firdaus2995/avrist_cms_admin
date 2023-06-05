import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import React, { Suspense } from 'react';
import Layout from '../components/organisms/Layout';
import Loading from '../components/atoms/Loading';
import { useAppSelector } from '../store';
const LoginPage = React.lazy(async () => await import('../pages/Login'));
const DashboardPage = React.lazy(async () => await import('../pages/Dashboard'));
const NotFoundPage = React.lazy(async () => await import('../pages/NotFound'));

// IMPORT USERS PAGE
const UserPage = React.lazy(async () => await import('../pages/Users'));
const UserNewPage = React.lazy(async () => await import('../pages/Users/UsersNew'));
const UserEditPage = React.lazy(async () => await import('../pages/Users/UsersEdit'));

const RolesPage = React.lazy(async () => await import('../pages/Roles'));
const RolesNewPage = React.lazy(async () => await import('../pages/Roles/RolesNew'));
const RolesEditPage = React.lazy(async () => await import('../pages/Roles/RolesEdit'));

const MenuManagementPage = React.lazy(async () => await import('../pages/MenuManagement'));

const PageTemplatePage = React.lazy(async () => await import('../pages/PageTemplate'));


export default function RoutesComponent() {
  const { accessToken } = useAppSelector(state => state.loginSlice);
  return (
    <Routes>
      <Route element={<ProtectedRoute token={!accessToken} redirectPath="/" />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute token={accessToken} />}>
        <Route
          element={
            <Suspense fallback={<Loading />}>
              <Layout />
            </Suspense>
          }>
          <Route index element={<DashboardPage />} />
          {/* USER PAGES ROUTE */}
          <Route path="user" element={<UserPage />} />
          <Route path="user/new" element={<UserNewPage />} />
          <Route path="user/edit" element={<UserEditPage />} />
          {/* ROLES PAGES */}
          <Route path="roles" element={<RolesPage />} />
          <Route path="roles/new" element={<RolesNewPage />} />
          <Route path="roles/edit/:id" element={<RolesEditPage />} />
          <Route path="roles/detail/:id" element={<RolesEditPage />} />
          {/* MENU MANAGEMENT PAGES ROUTE */}
          <Route path="menu" element={<MenuManagementPage />} />
          {/* PAGE TEMPLATE PAGES ROUTE */}
          <Route path="pageTemplate" element={<PageTemplatePage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

const ProtectedRoute = ({
  token,
  redirectPath = '/login',
}: {
  token: any;
  redirectPath?: string;
}) => {
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
