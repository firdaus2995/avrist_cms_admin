import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { t } from 'i18next';

import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import FormList from '@/components/molecules/FormList';

import {
  useGetGlobalConfigByIdQuery,
  useCreateGlobalConfigDataMutation,
  useUpdateGlobalConfigDataMutation,
} from '@/services/GlobalConfigData/globalConfigDataApi';

import { useAppDispatch } from '@/store';
import ModalConfirm from '@/components/molecules/ModalConfirm';

import CancelIcon from '@/assets/cancel.png';

import { openToast } from '@/components/atoms/Toast/slice';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

export default function GlobalConfigDataNew() {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();

  // FORM VALIDATION
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // DEFAULT MODE
  const [mode, setMode] = useState('new');

  // LEAVE MODAL STATE
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  // RTK CREATE
  const [createGlobalConfig, { isLoading }] = useCreateGlobalConfigDataMutation();
  // RTK EDIT
  const [editGlobalConfig, { isLoading: isLoadingEdit }] = useUpdateGlobalConfigDataMutation();
  // RTK GET DATA DETAIL
  const fetchGlobalConfigQuery = useGetGlobalConfigByIdQuery({id: params?.key});
  const { data: defaultGlobalConfig } = fetchGlobalConfigQuery;

  // SET DEFAULT PAGE MODE
  useEffect(() => {
    if (location.pathname.includes('/edit')) {
      setMode('edit');
    } else {
      setMode('new');
    }
  }, [location.pathname]);

  // FETCH DEFAULT FORM DATA FOR DETAIL / EDIT
  useEffect(() => {
    if (mode !== 'new') {
      const refetch = async () => {
        await fetchGlobalConfigQuery.refetch();
      };
      void refetch();
    }
  }, [mode]);

  // FILL DATA FOR DETAIL / EDIT
  useEffect(() => {
    const data = defaultGlobalConfig?.getDetail;
    if (data) {
      const defaultVariable = data?.variable || '';
      const defaultValue = data?.value || '';
      const defaultDescription = data?.description || '';
      const defaultId = data?.id || '';

      setValue('key', defaultVariable);
      setValue('value', defaultValue);
      setValue('description', defaultDescription);
      setValue('defaultId', defaultId);
    }
  }, [defaultGlobalConfig]);

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate('/global-config-data');
  };

  const onSubmit = (e: any) => {
    if (e.defaultId) {
      onSubmitEdit(e);
    } else {
      onSubmitNew(e);
    }
  };

  const onSubmitEdit = (e: any) => {
    const payload = {
      id: Number(e.defaultId),
      variable: e.key,
      value: e.value,
      description: e.description,
    };
    editGlobalConfig(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: `${t('user.global-config-data-new.toast-success-edit')}`,
          }),
        );
        navigate('/global-config-data');
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t(`errors.global-config.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  const onSubmitNew = (e: any) => {
    const payload = {
      variable: e.key,
      value: e.value,
      description: e.description,
    };
    createGlobalConfig(payload)
      .unwrap()
      .then((d: any) => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: `${t('user.global-config-data-new.toast-success-add')} ${d.configCreate.value}`,
          }),
        );
        navigate('/global-config-data');
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: `${t('user.global-config-data-new.toast-failed-add')} ${payload.value}`,
          }),
        );
      });
  };

  return (
    <TitleCard
      title={`${mode === 'new' ? 'New' : 'Edit'}${' ' + t('user.global-config-data-new.title.global-config-data')}`} // Use t() to translate titles
      topMargin="mt-2">
      {/* ON CANCEL */}
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? t('user.global-config-data-new.modal.confirmation')} // Translate modal title
        cancelTitle={t('user.global-config-data-new.btn.no')} // Translate cancel button text
        message={messageLeaveModalShow ?? ''} // Translate modal message
        submitAction={onLeave}
        submitTitle={t('user.global-config-data-new.btn.yes')} // Translate submit button text
        icon={CancelIcon}
        btnSubmitStyle="btn-warning"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-100 mt-[35px]">
        <div className="flex flex-col gap-[30px]">
          <Controller
            key="key"
            name="key"
            control={control}
            defaultValue=""
            rules={{
              required: { value: true, message: t('user.global-config-data-new.form.key.required') }, // Translate form field messages
            }}
            render={({ field }) => (
              <FormList.TextField
                {...field}
                key="key"
                labelTitle={t('user.global-config-data-new.form.key.label')} // Translate form field label
                labelRequired
                placeholder={t('user.global-config-data-new.form.key.placeholder')} // Translate placeholder
                error={!!errors?.key?.message}
                helperText={errors?.key?.message}
                border={false}
              />
            )}
          />
          <Controller
            key="value"
            name="value"
            control={control}
            defaultValue=""
            rules={{
              required: { value: true, message: t('user.global-config-data-new.form.value.required') }, // Translate form field messages
            }}
            render={({ field }) => (
              <FormList.TextAreaField
                {...field}
                key="value"
                labelTitle={t('user.global-config-data-new.form.value.label')} // Translate form field label
                labelRequired
                placeholder={t('user.global-config-data-new.form.value.placeholder')} // Translate placeholder
                error={!!errors?.value?.message}
                helperText={errors?.value?.message}
                border={false}
              />
            )}
          />
          <Controller
            key="description"
            name="description"
            control={control}
            defaultValue=""
            rules={{
              required: { value: false, message: t('user.global-config-data-new.form.description.required') }, // Translate form field messages
            }}
            render={({ field }) => (
              <FormList.TextAreaField
                {...field}
                key="description"
                labelTitle={t('user.global-config-data-new.form.description.label')} // Translate form field label
                placeholder={t('user.global-config-data-new.form.description.placeholder')} // Translate placeholder
                error={!!errors?.description?.message}
                helperText={errors?.description?.message}
                border={false}
              />
            )}
          />
        </div>

        <div className="flex justify-end items-end gap-2 mt-16">
          <button
            className="btn btn-outline btn-md"
            onClick={(e) => {
              e.preventDefault();
              setLeaveTitleModalShow(t('user.global-config-data-new.modal.confirmation'));
              setMessageLeaveModalShow(t('user.global-config-data-new.modal.leave-confirmation'));
              setShowLeaveModal(true);
            }}>
            {isLoading || isLoadingEdit ? t('user.global-config-data-new.btn.loading') : t('user.global-config-data-new.btn.cancel')} {/* Translate button text */}
          </button>
          <button type="submit" className="btn btn-success btn-md text-white">
            {isLoading || isLoadingEdit ? t('user.global-config-data-new.btn.loading') : t('user.global-config-data-new.btn.save')} {/* Translate button text */}
          </button>
        </div>
      </form>
    </TitleCard>
  );
}
