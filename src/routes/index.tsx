import { Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';
import Layout from '../components/molecules/Layout';
import Loading from '../components/atoms/Loading';
const LoginPage = React.lazy(async () => await import('../pages/Login'));
const DashboardPage = React.lazy(async () => await import('../pages/Dashboard'));
const NotFoundPage = React.lazy(async () => await import('../pages/NotFound'));

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
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
