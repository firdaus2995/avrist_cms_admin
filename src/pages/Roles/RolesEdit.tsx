import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { t } from 'i18next';

import PermissionList from '../../components/organisms/PermissionList';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import RoleRenderer from '../../components/atoms/RoleRenderer';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useGetDetailRoleQuery, useRoleUpdateMutation } from '../../services/Roles/rolesApi';
import { setPermissions, setId, resetForm } from '../../services/Roles/rolesSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import { Controller, useForm } from 'react-hook-form';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

export default function RolesEdit() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    reValidateMode: 'onSubmit',
  });

  // STORE STATE
  const { id, permissions } = useAppSelector((state) => {
    return state.rolesSlice;
  });

  // USESTATE STATE
  const [initialRoleName, setInitialRoleName] = useState("");
  const [editMode, setEditMode] = useState(true);
  const [showComfirm, setShowComfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setmessageConfirm] = useState('');

  // RTK GET DETAIL ROLE
  const fetchQuery = useGetDetailRoleQuery({ id: parseInt(params.id ?? '') }, {
    refetchOnMountOrArgChange: true,
  });
  const { data, isFetching } = fetchQuery;

  // RTK ROLE UPDATE
  const [roleUpdate, { isLoading: onUpdateLoading }] = useRoleUpdateMutation();

  useEffect(() => {
    if (data) {
      const defaultValues: any = {};
      defaultValues.roleName = data?.roleById?.name;
      defaultValues.roleDescription = data?.roleById?.description;
      reset({ ...defaultValues });

      dispatch(setId(parseInt(params.id ?? '')));
      dispatch(setPermissions(data.roleById.permissions.split(',').filter((element: string) => element !== 'HOME_READ')));

      const findDetail = window.location.pathname.includes('detail');

      setEditMode(!findDetail);
      setInitialRoleName(data?.roleById?.name);
    }
  }, [data]);

  const onSubmit = (data: any) => {
    const payload = {
      id,
      name: data?.roleName,
      description: data?.roleDescription,
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
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t(`errors.role.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  const onLeave = () => {
    setShowComfirm(false);
    navigate('/roles');
  };

  return (
    <RoleRenderer allowedRoles={editMode ? ['ROLE_EDIT'] : ['ROLE_READ']}>
      <TitleCard title={`${t('roles.edit.title')} ${initialRoleName}`}>
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
        <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
          {
            isFetching ? (
              <h1 className="text-center py-9">{t('user.roles-edit.loading')}</h1>
            ) : (
              <div className="flex flex-col gap-5">
              <Controller
                name='roleName'
                control={control}
                defaultValue=''
                rules={{ required: t('components.atoms.required') ?? ''}}
                render={({ field }) => (
                  <InputText
                    {...field}
                    labelTitle={t('roles.role-name')}
                    labelStyle="font-bold"
                    placeholder={t('components.organism.content')}
                    direction='row'
                    inputWidth={400}
                    labelWidth={200}
                    isError={!!errors?.roleName}
                  />
                )}
              />
              <Controller
                name='roleDescription'
                control={control}
                defaultValue=''
                rules={{ required: t('components.atoms.required') ?? ''}}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    labelTitle={t('roles.role-description')}
                    labelStyle="font-bold"
                    placeholder={t('components.organism.content')}
                    direction='row'
                    inputWidth={400}
                    labelWidth={200}
                    isError={!!errors?.roleDescription}
                  />
                )}
              />
              </div>
            )
          }
          <PermissionList
            permissionList={data?.roleById.permissionHierarchy ?? []}
            loading={isFetching}
            disabled={!editMode}
          />
          <div className="flex justify-end gap-3">
            <button
              type='button'
              className="btn btn-outline btn-md"
              onClick={() => {
                setTitleConfirm(t('user.roles-edit.btn.cancelconfirm') ?? '');
                setmessageConfirm(t('user.roles-edit.btn.cancelconfirmMessage') ?? '');
                setShowComfirm(true);
              }}
            >
              {t('btn.cancel')}
            </button>
            {
              editMode ? (
                <button
                  type='submit'
                  className="btn btn-success btn-md text-white"
                >
                  {onUpdateLoading ? t('user.roles-edit.btn.saveloading') : t('btn.save-alternate')}
                </button>
              ) : (
                <button
                  type='button'
                  className="btn btn-success btn-md text-white"
                  onClick={() => {
                    navigate(`/roles/edit/${params.id}`);
                  }}
                >
                  {t('user.roles-edit.btn.editRoles')}
                </button>
              )
            }
          </div>
        </form>
      </TitleCard>
    </RoleRenderer>
  );
}
