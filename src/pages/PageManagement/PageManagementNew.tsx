import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useTranslation } from 'react-i18next';
import { useGetPermissionHirarkyQuery, useRoleCreateMutation } from '../../services/Roles/rolesApi';
import { useAppSelector, useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { useNavigate } from 'react-router-dom';
import { resetForm } from '../../services/Roles/rolesSlice';
import PermissionList from '../../components/organisms/PermissionList';
import PermissionForm from '../../components/organisms/PermissionForm';
import ModalConfirmLeave from '../../components/molecules/ModalConfirm';
import CancelIcon from "../../assets/cancel.png";
import { useState } from 'react';

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
  }

  return (
    <>
      <TitleCard title={t('roles.add.title')} topMargin="mt-2">
        <ModalConfirmLeave
          open={showComfirm}
          cancelAction={() => {
            setShowComfirm(false);
          }}
          title={titleConfirm}
          cancelTitle="No"
          message={messageConfirm}
          submitAction={onLeave}
          submitTitle="Yes"
          icon={CancelIcon}
          btnType='btn-warning'
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
              setTitleConfirm('Are you sure?');
              setmessageConfirm(`Do you want to cancel all the process?`);
              setShowComfirm(true);
            }}>
            {t('btn.cancel')}
          </button>
          <button
            className="btn btn-success btn-md"
            onClick={() => {
              onSave();
            }}>
            {onSaveLoading ? 'Loading...' : t('btn.save')}
          </button>
        </div>
      </TitleCard>
    </>
  );
}
