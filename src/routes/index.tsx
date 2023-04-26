import { Route, Routes } from 'react-router-dom';
import React from 'react';
const LoginPage = React.lazy(() => import('../pages/Login'));
const DashboardPage = React.lazy(() => import('../pages/Dashboard'));
const NotFoundPage = React.lazy(() => import('../pages/NotFound'));

export default function RoutesComponent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route index element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
