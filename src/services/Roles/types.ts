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
