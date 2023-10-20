import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { t } from 'i18next';

import PermissionList from '../../components/organisms/PermissionList';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import RoleRenderer from '../../components/atoms/RoleRenderer';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useGetDetailRoleQuery, useRoleUpdateMutation } from '../../services/Roles/rolesApi';
import { setName, setDescription, setPermissions, setId, resetForm } from '../../services/Roles/rolesSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';

export default function RolesEdit() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  // STORE STATE
  const { name, description, permissions, id } = useAppSelector((state) => {
    return state.rolesSlice;
  });

  // USESTATE STATE
  const [editMode, setEditMode] = useState(true);
  const [showComfirm, setShowComfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setmessageConfirm] = useState('');

  // RTK GET DETAIL ROLE
  const fetchQuery = useGetDetailRoleQuery({ id: parseInt(params.id ?? '') });
  const { data, isFetching } = fetchQuery;

  // RTK ROLE UPDATE
  const [roleUpdate, { isLoading: onUpdateLoading }] = useRoleUpdateMutation();

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
    void fetchQuery.refetch();
  }, []);

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
  };

  return (
    <RoleRenderer allowedRoles={['ROLE_EDIT']}>
      <TitleCard title={t('roles.edit.title')}>
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
          btnSubmitStyle="btn-warning"
        />
        {isFetching ? (
          <h1 className="text-center py-9">{t('user.roles-edit.loading')}</h1>
        ) : (
          <div className="w-[500px] mb-16">
            <InputText
              labelTitle={t('roles.role-name')}
              placeholder={t('components.organism.content') ?? ''}
              onChange={e => dispatch(setName(e.target.value))}
              containerStyle="mb-[22px] flex flex-row"
              labelStyle="font-bold w-[200px]"
              value={name}
              disabled={!editMode}
            />
            <TextArea
              labelTitle={t('roles.role-description')}
              placeholder={t('components.organism.content') ?? ''}
              onChange={e => dispatch(setDescription(e.target.value))}
              containerStyle=" flex flex-row"
              labelStyle="font-bold w-[200px]"
              value={description}
              disabled={!editMode}
            />
          </div>
        )}
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
    </RoleRenderer>
  );
}
