import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { t } from 'i18next';
import { useForm, Controller } from 'react-hook-form';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import FormList from '@/components/molecules/FormList';

import ModalConfirm from '@/components/molecules/ModalConfirm';

import CancelIcon from '@/assets/cancel.png';

export default function GlobalConfigDataNew() {
  const location = useLocation();
  const navigate = useNavigate();

  // FORM VALIDATION
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // DEFAULT MODE
  const [mode, setMode] = useState('new');

  // LEAVE MODAL STATE
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  // SET DEFAULT PAGE MODE
  useEffect(() => {
    if (location.pathname.includes('/edit')) {
      setMode('edit');
    } else {
      setMode('new');
    }
  }, [location.pathname]);

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate('/global-config-data');
  };

  const onSubmit = (e: any) => {
    console.log(e);
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
            {t('btn.cancel')}
          </button>
          <button type="submit" className="btn btn-success btn-md text-white">
            {t('btn.save')}
          </button>
        </div>
      </form>
    </TitleCard>
  );
}
