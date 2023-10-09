import PermissionCollapse from '../../molecules/PermissionCollapse';
import PermissionImg from '../../../assets/permission.png';
import { IPermisionList } from './types';
import { useAppSelector, useAppDispatch } from '../../../store';
import { setPermissions } from '../../../services/Roles/rolesSlice';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

export default function PermissionList(props: IPermisionList) {
  const { permissionList, loading, disabled } = props;
  const dispatch = useAppDispatch();
  const { permissions } = useAppSelector(state => state.rolesSlice);
  const [allPermission, setAllPermission] = useState<string[]>([]);

  useEffect(() => {
    if (permissionList) {
      const temp = extractPermissions(permissionList);
      setAllPermission(temp);
    }
  }, [permissionList]);

  useEffect(() => {
    console.log('permisss ', permissions);
  }, [permissions]);

  function extractPermissions(data: any) {
    const permissionsArray: string[] = [];

    for (const category of data) {
      for (const content of category.listContent) {
        for (const detail of content.listDetail) {
          permissionsArray.push(detail.permission);
        }
      }
    }

    return permissionsArray;
  }

  const onChangePermission = (d: string) => {
    const checkIfExist = permissions.includes(d);

    if (checkIfExist) {
      const updatedPermissions = permissions.filter((p: any) => p !== d);
      dispatch(setPermissions(updatedPermissions));
    } else {
      const basePermission = d.replace(/_(READ|CREATE|EDIT|DELETE)$/, '');

      const readPermission = `${basePermission}_READ`;
      if (allPermission.includes(readPermission)) {
        dispatch(setPermissions([...permissions, d, readPermission]));
      } else {
        dispatch(setPermissions([...permissions, d]));
      }
    }
  };

  return (
    <div>
      <div>
        <div className="flex gap-4 items-center">
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
