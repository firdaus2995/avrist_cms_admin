import { Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';
import Layout from '../components/molecules/Layout';
import Loading from '../components/atoms/Loading';
const LoginPage = React.lazy(async () => await import('../pages/Login'));
const DashboardPage = React.lazy(async () => await import('../pages/Dashboard'));
const NotFoundPage = React.lazy(async () => await import('../pages/NotFound'));

const RolesPage = React.lazy(async () => await import('../pages/Roles'));
const RolesNewPage = React.lazy(async () => await import('../pages/Roles/RolesNew'));

export default function RoutesComponent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
        <Route path="roles/edit" element={<RolesNewPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
