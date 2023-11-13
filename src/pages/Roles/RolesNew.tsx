import { useEffect, useState } from 'react';
import { t } from 'i18next';

import PermissionList from '../../components/organisms/PermissionList';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import RoleRenderer from '../../components/atoms/RoleRenderer';
import { useGetPermissionHirarkyQuery, useRoleCreateMutation } from '../../services/Roles/rolesApi';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useAppSelector, useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { useNavigate } from 'react-router-dom';
import { resetForm } from '../../services/Roles/rolesSlice';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import { Controller, useForm } from 'react-hook-form';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

export default function RolesNew() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    reValidateMode: 'onSubmit',
  });

  // USESTATE STATE
  const [showComfirm, setShowConfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setMessageConfirm] = useState('');

  // RTK GET DETAIL ROLE
  const { data, isFetching } = useGetPermissionHirarkyQuery(null);
  const { permissions } = useAppSelector(state => state.rolesSlice);
  
  // RTK ROLE CREATE
  const [roleCreate, { isLoading: onSaveLoading }] = useRoleCreateMutation();

  useEffect(() => {
    dispatch(resetForm());
  }, []);

  const onSubmit = (data: any) => {    
    const payload = {
      name: data?.roleName,
      description: data?.roleDescription,
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
    setShowConfirm(false);
    navigate('/roles');
  };  

  return (
    <RoleRenderer allowedRoles={['ROLE_CREATE']}>
      <TitleCard title={t('roles.add.title')} topMargin="mt-2">
        <ModalConfirm
          open={showComfirm}
          cancelAction={() => {
            setShowConfirm(false);
          }}
          title={titleConfirm}
          cancelTitle={t('user.roles-new.modal-confirm.no')}
          message={messageConfirm}
          submitAction={onLeave}
          submitTitle={t('user.roles-new.modal-confirm.yes')}
          icon={CancelIcon}
          btnSubmitStyle="btn-warning"
        />
        <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
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
          <PermissionList
            permissionList={data?.permissionHierarchy.list ?? []}
            loading={isFetching}
          />
          <div className="flex justify-end gap-3">
            <button
              type='button'
              className="btn btn-outline btn-md"
              onClick={() => {
                setTitleConfirm(t('user.roles-new.modal-confirm.are-you-sure') ?? '');
                setMessageConfirm(t('user.roles-new.modal-confirm.cancel-all-process') ?? '');
                setShowConfirm(true);
              }}
            >
              {t('btn.cancel')}
            </button>
            <button
              type='submit'
              className="btn btn-success btn-md text-white"
             >
              {onSaveLoading ? t('loading') + '...' : t('btn.save')}
            </button>
          </div>
        </form>
      </TitleCard>
    </RoleRenderer>
  );
}
