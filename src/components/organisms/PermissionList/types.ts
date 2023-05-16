import { IListPermission } from '../../../services/Roles/types';

export interface IPermisionList {
  permissionList: IListPermission[];
  loading: boolean;
  disabled?: boolean;
}
