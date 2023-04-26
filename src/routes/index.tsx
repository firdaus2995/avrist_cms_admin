import { Route, Routes } from 'react-router-dom';
import React from 'react';
const LoginPage = React.lazy(async () => await import('../pages/Login'));
const DashboardPage = React.lazy(async () => await import('../pages/Dashboard'));
const NotFoundPage = React.lazy(async () => await import('../pages/NotFound'));

export default function RoutesComponent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route index element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
