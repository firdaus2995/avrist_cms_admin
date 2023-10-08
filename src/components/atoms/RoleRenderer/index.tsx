import React, { ReactNode } from 'react';
import { store } from '@/store';

interface RoleRendererProps {
  allowedRoles: string[];
  children: ReactNode;
}

const RoleRenderer: React.FC<RoleRendererProps> = ({ allowedRoles, children }) => {
  const roles = store.getState().loginSlice.roles;

  if (roles.some((role: any) => allowedRoles.includes(role))) {
    return <>{children}</>;
  }
  return <div />
};

export default RoleRenderer;
