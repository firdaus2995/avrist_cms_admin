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
  const fetchGlobalConfigQuery = useGetGlobalConfigByIdQuery(params?.key);
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
    const data = defaultGlobalConfig?.getConfig;
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
      .then((d: any) => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: `Success edit Global Config ${d.configCreate.value}`,
          }),
        );
        navigate('/global-config-data');
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: `Failed edit Global Config ${payload.value}`,
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
            message: `Success register Global Config ${d.configCreate.value}`,
          }),
        );
        navigate('/global-config-data');
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: `Failed add Global Config ${payload.value}`,
          }),
        );
      });
  };

  return (
    <TitleCard
      title={`${mode === 'new' ? 'New' : 'Edit'}${' Global Config Data'}`}
      topMargin="mt-2">
      {/* ON CANCEL */}
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? ''}
        cancelTitle="No"
        message={messageLeaveModalShow ?? ''}
        submitAction={onLeave}
        submitTitle="Yes"
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
              required: { value: true, message: `Key is required` },
            }}
            render={({ field }) => (
              <FormList.TextField
                {...field}
                key="key"
                labelTitle="Key"
                labelRequired
                placeholder="Enter key"
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
              required: { value: true, message: `Value is required` },
            }}
            render={({ field }) => (
              <FormList.TextAreaField
                {...field}
                key="value"
                labelTitle="Value"
                labelRequired
                placeholder="Enter value"
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
              required: { value: false, message: `Description is required` },
            }}
            render={({ field }) => (
              <FormList.TextAreaField
                {...field}
                key="description"
                labelTitle="Description"
                placeholder="Enter description"
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
            onClick={e => {
              e.preventDefault();
              setLeaveTitleModalShow(t('modal.confirmation'));
              setMessageLeaveModalShow(t('modal.leave-confirmation'));
              setShowLeaveModal(true);
            }}>
            {isLoading || isLoadingEdit ? 'Loading...' : t('btn.cancel')}
          </button>
          <button type="submit" className="btn btn-success btn-md text-white">
            {isLoading || isLoadingEdit ? 'Loading...' : t('btn.save')}
          </button>
        </div>
      </form>
    </TitleCard>
  );
}
