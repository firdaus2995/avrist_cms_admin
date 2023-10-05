import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import React, { Suspense } from 'react';

import Layout from '../components/organisms/Layout';
import Loading from '../components/atoms/Loading';
import { useAppSelector } from '../store';
import { getCredential } from '@/utils/Credential'; 

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
const PageTemplateNewPage = React.lazy(
  async () => await import('../pages/PageTemplates/PageTemplatesNew'),
);

// IMPORT EMAIL FORM BUILDER PAGE
const EmailFormBuilderListPage = React.lazy(async () => await import('../pages/EmailFormBuilder'));
const EmailFormBuilderNewPage = React.lazy(
  async () => await import('../pages/EmailFormBuilder/EmailFormBuilderNew'),
);
const EmailFormBuilderEditPage = React.lazy(
  async () => await import('../pages/EmailFormBuilder/EmailFormBuilderEdit'),
);
const EmailBodyNewPage = React.lazy(
  async () => await import('../pages/EmailFormBuilder/EmailBodyNew'),
)
const EmailBodyPreviewPage = React.lazy(
  async () => await import('../pages/EmailFormBuilder/EmailBodyPreview'),
)
const EmailBodyEditPage = React.lazy(
  async () => await import('../pages/EmailFormBuilder/EmailBodyEdit'),
)

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

const GlobalConfigDataPage = React.lazy(async () => await import('@/pages/GlobalConfigData'));
const GlobalConfigDataNewPage = React.lazy(async () => await import('@/pages/GlobalConfigData/GlobalConfigDataNew'));

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
          <Route element={<ProtectedPage permission="USER_READ" />}>
            <Route path="user" element={<UserPage />} />
          </Route>
          <Route element={<ProtectedPage permission="USER_CREATE" />}>
            <Route path="user/new" element={<UserNewPage />} />
          </Route>
          <Route element={<ProtectedPage permission="USER_EDIT" />}>
            <Route path="user/edit/:id" element={<UserEditPage />} />
          </Route>
          {/* ROLES PAGES */}
          <Route element={<ProtectedPage permission="ROLE_READ" />}>
            <Route path="roles" element={<RolesPage />} />
          </Route>
          <Route element={<ProtectedPage permission="ROLE_CREATE" />}>
            <Route path="roles/new" element={<RolesNewPage />} />
          </Route>
          <Route element={<ProtectedPage permission="ROLE_EDIT" />}>
            <Route path="roles/edit/:id" element={<RolesEditPage />} />
          </Route>
          <Route element={<ProtectedPage permission="ROLE_READ" />}>
            <Route path="roles/detail/:id" element={<RolesEditPage />} />
          </Route>
          {/* MENU MANAGEMENT PAGES ROUTE */}
          <Route element={<ProtectedPage permission="MENU_READ" />}>
            <Route path="menu" element={<MenuManagementPage />} />
          </Route>
          {/* PAGE TEMPLATE PAGES ROUTE */}
          <Route element={<ProtectedPage permission="PAGE_TEMPLATE_READ" />}>
            <Route path="page-template" element={<PageTemplatePage />} />
          </Route>
          <Route element={<ProtectedPage permission="PAGE_TEMPLATE_REGISTRATION" />}>
            <Route path="page-template/new" element={<PageTemplateNewPage />} />
          </Route>
          <Route element={<ProtectedPage permission="PAGE_TEMPLATE_READ" />}>
            <Route path="page-template/detail/:id" element={<PageTemplateNewPage />} />
          </Route>
          <Route element={<ProtectedPage permission="PAGE_TEMPLATE_EDIT" />}>
            <Route path="page-template/edit/:id" element={<PageTemplateNewPage />} />
          </Route>
          {/* EMAIL FORM BUILDER PAGES ROUTE */}
          <Route element={<ProtectedPage permission="EMAIL_FORM_READ" />}>
            <Route path="email-form-builder" element={<EmailFormBuilderListPage />} />
          </Route>
          <Route element={<ProtectedPage permission="EMAIL_FORM_CREATE" />}>
            <Route path="email-form-builder/new" element={<EmailFormBuilderNewPage />} />
          </Route>
          <Route element={<ProtectedPage permission="EMAIL_FORM_EDIT" />}>
            <Route path="email-form-builder/edit/:id" element={<EmailFormBuilderEditPage />} />
          </Route>
          <Route element={<ProtectedPage permission="EMAIL_FORM_CREATE" />}>
            <Route path="email-form-builder/new-body" element={<EmailBodyNewPage />} />
          </Route>
          <Route element={<ProtectedPage permission="EMAIL_FORM_READ" />}>
            <Route path="email-form-builder/view-body/:id" element={<EmailBodyPreviewPage />} />
          </Route>
          <Route element={<ProtectedPage permission="EMAIL_FORM_EDIT" />}>
            <Route path="email-form-builder/edit-body/:id" element={<EmailBodyEditPage />} />
          </Route>
          {/* PAGE MANAGEMENT */}
          <Route element={<ProtectedPage permission="PAGE_READ" />}>
            <Route path="page-management" element={<PageManagementPage />} />
          </Route>
          <Route element={<ProtectedPage permission="PAGE_READ" />}>
            <Route path="page-management/archive" element={<PageManagementArchivePage />} />
          </Route>
          <Route element={<ProtectedPage permission="PAGE_CREATE" />}>
            <Route path="page-management/new" element={<PageManagementNewPage />} />
          </Route>
          <Route element={<ProtectedPage permission="PAGE_READ" />}>
            <Route path="page-management/detail/:id" element={<PageManagementDetailPage />} />
          </Route>
          {/* CONTENT TYPE */}
          <Route element={<ProtectedPage permission="CONTENT_TYPE_READ" />}>
            <Route path="content-type" element={<ContentTypePage />} />
          </Route>
          <Route element={<ProtectedPage permission="CONTENT_TYPE_CREATE" />}>
            <Route path="content-type/new" element={<ContentTypeNewPage />} />
          </Route>
          <Route element={<ProtectedPage permission="CONTENT_TYPE_EDIT" />}>
            <Route path="content-type/edit/:id" element={<ContentTypeEditPage />} />
          </Route>
          <Route element={<ProtectedPage permission="CONTENT_TYPE_READ" />}>
            <Route path="content-type/:id" element={<ContentTypeDetailPage />} />
          </Route>
          {/* CONTENT MANAGER */}
          <Route element={<ProtectedPage permission="CONTENT_MANAGER_READ" />}>
            <Route path="content-manager" element={<ContentManagerPage />} />
          </Route>
          <Route element={<ProtectedPage permission="CONTENT_MANAGER_READ" />}>
            <Route path="content-manager/:id" element={<ContentManagerDetailPage />} />
          </Route>
          <Route element={<ProtectedPage permission="CONTENT_MANAGER_CREATE" />}>
            <Route path="content-manager/:id/category/new" element={<CategoryNew />} />
          </Route>
          <Route element={<ProtectedPage permission="CONTENT_MANAGER_EDIT" />}>
            <Route path="content-manager/:id/category/edit/:categoryid" element={<CategoryEdit />} />
          </Route>
          <Route element={<ProtectedPage permission="CONTENT_MANAGER_READ" />}>
            <Route path="content-manager/:id/archive" element={<ContentManagerArchivePage />} />
          </Route>
          <Route element={<ProtectedPage permission="CONTENT_MANAGER_CREATE" />}>
            <Route path="content-manager/:id/data/new" element={<ContentManagerNewPage />} />
          </Route>
          <Route element={<ProtectedPage permission="CONTENT_MANAGER_READ" />}>
            <Route path="content-manager/:id/detail/:dataId" element={<ContentManagerDetailDataPage />} />
          </Route>
          {/* GLOBAL CONFIG DATA */}
          <Route element={<ProtectedPage permission="GLOBAL_CONFIG_READ" />}>
            <Route path="global-config-data" element={<GlobalConfigDataPage />} />
          </Route>
          <Route element={<ProtectedPage permission="GLOBAL_CONFIG_CREATE" />}>
            <Route path="global-config-data/new" element={<GlobalConfigDataNewPage />} />
          </Route>
          <Route element={<ProtectedPage permission="GLOBAL_CONFIG_EDIT" />}>
            <Route path="global-config-data/edit/:key" element={<GlobalConfigDataNewPage />} />
          </Route>
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

const ProtectedPage = ({
  permission,
}: any) => {
  const checkPermission: boolean = getCredential().roles.includes(permission);
  if (!checkPermission) {
    return <Navigate to='/' replace />
  };
  
  return <Outlet />
}