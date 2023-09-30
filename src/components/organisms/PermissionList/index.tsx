import PermissionCollapse from '../../molecules/PermissionCollapse';
import PermissionImg from '../../../assets/permission.png';
import { IPermisionList } from './types';
import { useAppSelector, useAppDispatch } from '../../../store';
import { setPermissions } from '../../../services/Roles/rolesSlice';
import { t } from 'i18next';
export default function PermissionList(props: IPermisionList) {
  const { permissionList, loading, disabled } = props;
  const dispatch = useAppDispatch();
  const { permissions } = useAppSelector(state => state.rolesSlice);
  const onChangePermission = (d: string) => {
    const checkIfExist = permissions.find((p: string) => p === d);
    if (checkIfExist) {
      const filter = permissions.filter((f: any) => f !== checkIfExist);
      dispatch(setPermissions(filter));
    } else {
      dispatch(setPermissions([...permissions, d]));
    }
  };

  return (
    <div>
      <div>
        <div className="flex gap-4 items-center ">
          <img src={PermissionImg} alt="permission" className="h-[22px]" />
          <p className="font-bold text-lg">{t('components.organism.permission')}</p>
        </div>
        {loading ? (
          <h1 className="text-center py-9">{t('loading')}...</h1>
        ) : (
          permissionList.map((permission, i) => (
            <div className="p-3" key={i}>
              <PermissionCollapse
                permission={permission}
                disabled={disabled}
                onChange={onChangePermission}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
