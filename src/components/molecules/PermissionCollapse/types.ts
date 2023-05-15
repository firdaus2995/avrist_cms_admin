import { IListPermission, IListContent } from '../../../services/Roles/types';

export interface IPermissionCollase {
  permission: IListPermission;
  disabled?: boolean;
  onChange: (d: string) => void;
}

export interface ISubCollapse {
  subcollapse: IListContent;
  disabled?: boolean;
  onChange: (d: string) => void;
}
