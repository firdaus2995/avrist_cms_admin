import { IListPermission, IListContent } from '../../../services/Roles/types';

export interface IPermissionCollase {
  permission: IListPermission;
  onChange: (d: string) => void;
}

export interface ISubCollapse {
  subcollapse: IListContent;
  onChange: (d: string) => void;
}
