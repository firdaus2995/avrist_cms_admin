import { useEffect, useState } from 'react';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useTranslation } from 'react-i18next';
import { useGetDetailRoleQuery, useRoleUpdateMutation } from '../../services/Roles/rolesApi';
import {
  setName,
  setDescription,
  setPermissions,
  setId,
  resetForm,
} from '../../services/Roles/rolesSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import { useNavigate, useParams } from 'react-router-dom';
import { openToast } from '../../components/atoms/Toast/slice';

import PermissionForm from '../../components/organisms/PermissionForm';
import PermissionList from '../../components/organisms/PermissionList';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from "../../assets/cancel.png";

export default function RolesEdit() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { name, description, permissions, id } = useAppSelector(state => state.rolesSlice);
  const { t } = useTranslation();
  const fetchQuery = useGetDetailRoleQuery({ id: parseInt(params.id ?? '') });
  const { data, isFetching } = fetchQuery;
  const [roleUpdate, { isLoading: onUpdateLoading }] = useRoleUpdateMutation();
  const [editMode, setEditMode] = useState(true);
  const [showComfirm, setShowComfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setmessageConfirm] = useState('');

  useEffect(() => {
    dispatch(setId(parseInt(params.id ?? '')));
    if (data) {
      dispatch(setName(data.roleById.name));
      dispatch(setDescription(data.roleById.description));
      dispatch(setPermissions(data.roleById.permissions.split(',')));
      const findDetail = window.location.pathname.includes('detail');
      setEditMode(!findDetail);
    }
  }, [data]);

  useEffect(() => {
    void fetchQuery.refetch()
  }, [])

  const onSave = () => {
    const payload = {
      id,
      name,
      description,
      permissions: permissions.join(','),
    };
    roleUpdate(payload)
      .unwrap()
      .then(d => {
        dispatch(resetForm());
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('roles.edit.success-msg', { name: d.roleUpdate.name }),
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
            message: t('roles.edit.failed-msg', { name: payload.name }),
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
      <TitleCard title={t('roles.edit.title')}>
        {isFetching ? (
          <h1 className="text-center py-9">{t('user.roles-edit.loading')}</h1>
        ) : (
          <PermissionForm disabled={!editMode} />
        )}
        <ModalConfirm
          open={showComfirm}
          cancelAction={() => {
            setShowComfirm(false);
          }}
          title={titleConfirm}
          cancelTitle={t('user.roles-edit.modal.confirm.cancelTitle')}
          message={messageConfirm}
          submitAction={onLeave}
          submitTitle={t('user.roles-edit.modal.confirm.submitTitle')}
          icon={CancelIcon}
          btnSubmitStyle='btn-warning'
        />

        <PermissionList
          permissionList={data?.roleById.permissionHierarchy ?? []}
          loading={isFetching}
          disabled={!editMode}
        />
        <div className="flex float-right gap-3">
          <button
            className="btn btn-outline btn-md"
            onClick={() => {
              setTitleConfirm(t('user.roles-edit.btn.cancelconfirm') ?? '');
              setmessageConfirm(t('user.roles-edit.btn.cancelconfirmMessage') ?? '');
              setShowComfirm(true);
            }}>
            {t('btn.cancel')}
          </button>
          {editMode ? (
            <button
              className="btn btn-success btn-md text-white"
              onClick={() => {
                onSave();
              }}>
              {onUpdateLoading ? t('user.roles-edit.btn.saveloading') : t('btn.save')}
            </button>
          ) : (
            <button
              className="btn btn-success btn-md text-white"
              onClick={() => {
                window.location.assign(`/roles/edit/${params.id}`);
              }}>
              {t('user.roles-edit.btn.editRoles')}
            </button>
          )}
        </div>
      </TitleCard>
    </>
  );
}
