import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import React, { Suspense } from 'react';
import Layout from '../components/organisms/Layout';
import Loading from '../components/atoms/Loading';
import { useAppSelector } from '../store';
const LoginPage = React.lazy(async () => await import('../pages/Login'));
const LoginPortal = React.lazy(async () => await import('../pages/LoginPortal'));
const DashboardPage = React.lazy(async () => await import('../pages/Dashboard'));
const NotFoundPage = React.lazy(async () => await import('../pages/NotFound'));

const RolesPage = React.lazy(async () => await import('../pages/Roles'));
const RolesNewPage = React.lazy(async () => await import('../pages/Roles/RolesNew'));
const RolesEditPage = React.lazy(async () => await import('../pages/Roles/RolesEdit'));

export default function RoutesComponent() {
  const { accessToken } = useAppSelector(state => state.loginSlice);
  return (
    <Routes>
      <Route element={<ProtectedRoute token={!accessToken} redirectPath="/" />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loginportal" element={<LoginPortal />} />
      </Route>
      <Route element={<ProtectedRoute token={accessToken} />}>
        <Route
          element={
            <Suspense fallback={<Loading />}>
              <Layout />
            </Suspense>
          }>
          <Route index element={<DashboardPage />} />
          {/* ROLES PAGES */}
          <Route path="roles" element={<RolesPage />} />
          <Route path="roles/new" element={<RolesNewPage />} />
          <Route path="roles/edit/:id" element={<RolesEditPage />} />
          <Route path="roles/detail/:id" element={<RolesEditPage />} />
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
