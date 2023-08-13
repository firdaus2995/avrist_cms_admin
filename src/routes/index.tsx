import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import React, { Suspense } from 'react';

import Layout from '../components/organisms/Layout';
import Loading from '../components/atoms/Loading';
import { useAppSelector } from '../store';

const LoginPage = React.lazy(async () => await import('../pages/Login'));
const LoginPortal = React.lazy(async () => await import('../pages/LoginPortal'));
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

// IMPORT PAGE TEMPLATES PAGE
const PageTemplatePage = React.lazy(async () => await import('../pages/PageTemplates'));
// const PageTemplateNewPage = React.lazy(
//   async () => await import('../pages/PageTemplates/PageTemplatesNew'),
// );
const PageTemplateNewPageV2 = React.lazy(
  async () => await import('../pages/PageTemplates/PageTemplatesNewV2'),
);

// IMPORT EMAIL FORM BUILDER PAGE
const EmailFormBuilderListPage = React.lazy(async () => await import('../pages/EmailFormBuilder'));
const EmailFormBuilderNewPage = React.lazy(
  async () => await import('../pages/EmailFormBuilder/EmailFormBuilderNew'),
);
const EmailFormBuilderEditPage = React.lazy(
  async () => await import('../pages/EmailFormBuilder/EmailFormBuilderEdit'),
);

const PageManagementPage = React.lazy(async () => await import('../pages/PageManagement'));
const PageManagementArchivePage = React.lazy(
  async () => await import('../pages/PageManagement/PageManagementArchive'),
);
const PageManagementNewPage = React.lazy(
  async () => await import('../pages/PageManagement/PageManagementNew'),
);
const PageManagementDetailPage = React.lazy(
  async () => await import('../pages/PageManagement/PageManagementDetail'),
);

const ContentTypePage = React.lazy(async () => await import('@/pages/ContentType'));
const ContentTypeNewPage = React.lazy(
  async () => await import('@/pages/ContentType/ContentTypeNew'),
);
const ContentTypeDetailPage = React.lazy(
  async () => await import('@/pages/ContentType/ContentTypeDetail'),
);
const ContentTypeEditPage = React.lazy(
  async () => await import('@/pages/ContentType/ContentTypeEdit'),
);

const ContentManagerPage = React.lazy(async () => await import('@/pages/ContentManager'));
const ContentManagerDetailPage = React.lazy(
  async () => await import('@/pages/ContentManager/ContentManagerDetail'),
);
const ContentManagerNewPage = React.lazy(
  async () => await import('@/pages/ContentManager/ContentManagerNew'),
);

const CategoryNew = React.lazy(
  async () => await import('@/pages/ContentManager/tabs/Category/CategoryNew'),
);
const CategoryEdit = React.lazy(
  async () => await import('@/pages/ContentManager/tabs/Category/CategoryEdit'),
);
const ContentManagerArchivePage = React.lazy(
  async () => await import('@/pages/ContentManager/ContentManagerArchive'),
);
const ContentManagerDetailDataPage = React.lazy(
  async () => await import('@/pages/ContentManager/ContentManagerDetailData'),
);

export default function RoutesComponent() {
  const { accessToken } = useAppSelector(state => state.loginSlice);

  return (
    <Routes>
      <Route element={<ProtectedRoute token={!accessToken} redirectPath="/" />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<LoginPage />} />
        <Route path="/forgot-password/:token" element={<LoginPage />} />
        <Route path="/login-portal" element={<LoginPortal />} />
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
          <Route path="user/edit/:id" element={<UserEditPage />} />
          {/* ROLES PAGES */}
          <Route path="roles" element={<RolesPage />} />
          <Route path="roles/new" element={<RolesNewPage />} />
          <Route path="roles/edit/:id" element={<RolesEditPage />} />
          <Route path="roles/detail/:id" element={<RolesEditPage />} />
          {/* MENU MANAGEMENT PAGES ROUTE */}
          <Route path="menu" element={<MenuManagementPage />} />
          {/* PAGE TEMPLATE PAGES ROUTE */}
          <Route path="page-template" element={<PageTemplatePage />} />
          <Route path="page-template/new" element={<PageTemplateNewPageV2 />} />
          <Route path="page-template/detail/:id" element={<PageTemplateNewPageV2 />} />
          <Route path="page-template/edit/:id" element={<PageTemplateNewPageV2 />} />
          {/* EMAIL FORM BUILDER PAGES ROUTE */}
          <Route path="email-form-builder" element={<EmailFormBuilderListPage />} />
          <Route path="email-form-builder/new" element={<EmailFormBuilderNewPage />} />
          <Route path="email-form-builder/edit/:id" element={<EmailFormBuilderEditPage />} />
          {/* PAGE MANAGEMENT */}
          <Route path="page-management" element={<PageManagementPage />} />
          <Route path="page-management/archive" element={<PageManagementArchivePage />} />
          <Route path="page-management/new" element={<PageManagementNewPage />} />
          <Route path="page-management/detail" element={<PageManagementDetailPage />} />
          {/* CONTENT TYPE */}
          <Route path="content-type" element={<ContentTypePage />} />
          <Route path="content-type/new" element={<ContentTypeNewPage />} />
          <Route path="content-type/edit/:id" element={<ContentTypeEditPage />} />
          <Route path="content-type/:id" element={<ContentTypeDetailPage />} />
          {/* CONTENT MANAGER */}
          <Route path="content-manager" element={<ContentManagerPage />} />
          <Route path="content-manager/:id" element={<ContentManagerDetailPage />} />
          <Route path="content-manager/:id/category/new" element={<CategoryNew />} />
          <Route path="content-manager/:id/category/edit/:categoryid" element={<CategoryEdit />} />
          <Route path="content-manager/:id/archive" element={<ContentManagerArchivePage />} />
          <Route path="content-manager/:id/data/new" element={<ContentManagerNewPage />} />
          <Route
            path="content-manager/:id/detail/:dataId"
            element={<ContentManagerDetailDataPage />}
          />
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
