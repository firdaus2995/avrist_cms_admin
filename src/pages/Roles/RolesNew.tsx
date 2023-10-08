import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useTranslation } from 'react-i18next';
import { useGetPermissionHirarkyQuery, useRoleCreateMutation } from '../../services/Roles/rolesApi';
import { useAppSelector, useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { useNavigate } from 'react-router-dom';
import { resetForm } from '../../services/Roles/rolesSlice';
import PermissionList from '../../components/organisms/PermissionList';
import PermissionForm from '../../components/organisms/PermissionForm';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import { useState } from 'react';
import RoleRenderer from '../../components/atoms/RoleRenderer';

export default function RolesNew() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, isFetching } = useGetPermissionHirarkyQuery(null);
  const { name, description, permissions } = useAppSelector(state => state.rolesSlice);
  const [roleCreate, { isLoading: onSaveLoading }] = useRoleCreateMutation();
  const [showComfirm, setShowComfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setmessageConfirm] = useState('');

  const onSave = () => {
    const payload = {
      name,
      description,
      permissions: permissions.join(','),
    };
    roleCreate(payload)
      .unwrap()
      .then(d => {
        dispatch(resetForm());
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('roles.add.success-msg', { name: d.roleCreate.name }),
          }),
        );
        dispatch(resetForm());
        navigate('/roles');
      })
      .catch(err => {
        console.log(err);
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t('roles.add.failed-msg', { name: payload.name }),
          }),
        );
      });
  };

  const onLeave = () => {
    setShowComfirm(false);
    navigate('/roles');
  };

  return (
    <>
      <RoleRenderer allowedRoles={['ROLE_CREATE']}>
        <TitleCard title={t('roles.add.title')} topMargin="mt-2">
          <ModalConfirm
            open={showComfirm}
            cancelAction={() => {
              setShowComfirm(false);
            }}
            title={titleConfirm}
            cancelTitle={t('user.roles-new.modal-confirm.no')}
            message={messageConfirm}
            submitAction={onLeave}
            submitTitle={t('user.roles-new.modal-confirm.yes')}
            icon={CancelIcon}
            btnSubmitStyle="btn-warning"
          />
          <PermissionForm />
          <PermissionList
            permissionList={data?.permissionHierarchy.list ?? []}
            loading={isFetching}
          />
          <div className="flex float-right gap-3">
            <button
              className="btn btn-outline btn-md"
              onClick={() => {
                setTitleConfirm(t('user.roles-new.modal-confirm.are-you-sure') ?? '');
                setmessageConfirm(t('user.roles-new.modal-confirm.cancel-all-process') ?? '');
                setShowComfirm(true);
              }}>
              {t('btn.cancel')}
            </button>
            <button
              className="btn btn-success btn-md text-white"
              onClick={() => {
                onSave();
              }}>
              {onSaveLoading ? t('loading') + '...' : t('btn.save')}
            </button>
          </div>
        </TitleCard>
      </RoleRenderer>
    </>
  );
}
