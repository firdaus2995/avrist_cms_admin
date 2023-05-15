export interface IGetRolesPayload {
  pageIndex: number;
  limit: number;
  sortBy: string;
  direction: string;
  search: string;
}
export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string;
}
export interface IGetRolesResponse {
  roleList: {
    total: number;
    roles: Role[];
  };
}

interface IListDetail {
  isChecked: boolean;
  permission: string;
  permissionTitle: string;
  permissionTitleLabel: string;
}
export interface IListContent {
  titleLabel: string;
  listDetail: IListDetail[];
}
export interface IListPermission {
  categoryLabel: string;
  listContent: IListContent[];
}
export interface IGetPermissionResponse {
  permissionHierarchy: {
    list: IListPermission[];
  };
}

export interface IRolesSliceInitialState {
  name: string;
  description: string;
  permissions: string[];
}

export interface IRoleRequestPayload {
  name: string;
  description: string;
  permissions: string;
}

export interface IRoleRequestResponse {
  roleCreate: {
    name: string;
  };
}
