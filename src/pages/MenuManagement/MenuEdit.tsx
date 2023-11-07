import { t } from 'i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { InputText } from '../../components/atoms/Input/InputText';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { errorMessageTypeConverter } from '@/utils/logicHelper';
import { useGetGroupMenuDetailQuery, useUpdateGroupMenuMutation } from '@/services/Menu/menuApi';

export default function MenuNew() {
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

  // FORM STATE
  const [id] = useState<any>(Number(params.id));
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');  

  // RTK GET USER DETAIL
  const fetchGroupMenuDetailQuery = useGetGroupMenuDetailQuery(
    { id },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data } = fetchGroupMenuDetailQuery;  

  // RTK CREATE MENU
  const [editMenu, { isLoading }] = useUpdateGroupMenuMutation();

  function onSubmit(data: any) {
    const payload = {
      id,
      name: data?.name,
    };
    
    editMenu(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('user.menu-list.menuGroup.toast.success-create'),
          }),
        );
        navigate('/menu');
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t(`errors.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  useEffect(() => {
    if (data) {
      const menuDetail = data?.menuGroupDetail;

      const defaultValues: any = {};

      defaultValues.name = menuDetail.name;

      reset({ ...defaultValues });
    };
  }, [data]);

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate('/menu');
  };

  return (
    <TitleCard title={t('user.menu-list.menuGroup.texts.edit.title')} topMargin="mt-2">
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? ''}
        cancelTitle={t('user.menu-list.menuGroup.modal.button-no')}
        message={messageLeaveModalShow ?? ''}
        submitAction={onLeave}
        submitTitle={t('user.menu-list.menuGroup.modal.button-submit')}
        icon={CancelIcon}
        btnSubmitStyle="btn-warning"
      />
      <form
        className="flex flex-col w-100"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col mt-[60px] gap-5">
          {/* ROW 1 */}
          <div className="flex flex-row gap-14">
            <div className='flex flex-1'>
              <Controller
                name='name'
                control={control}
                defaultValue=''
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    direction='row'
                    labelWidth={200}
                    labelTitle={t('user.menu-list.menuGroup.inputs.label-groupname')}
                    labelStyle="font-semibold"
                    labelRequired
                    inputWidth={400}
                    roundStyle="xl"
                    placeholder={t('user.menu-list.menuGroup.inputs.label-groupname-placeholder')}
                    isError={!!errors?.name}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="mt-[200px] flex justify-end items-end gap-2">
          <button
            className="btn btn-outline btn-md"
            onClick={(event: any) => {
              event.preventDefault();
              setLeaveTitleModalShow(t('user.menu-list.menuGroup.modal.leave-confirmation-title'));
              setMessageLeaveModalShow(t('user.menu-list.menuGroup.modal.leave-confirmation-body'));
              setShowLeaveModal(true);
            }}>
            {isLoading ? t('loading') : t('btn.cancel')}
          </button>
          <button className="btn btn-success btn-md text-white" type="submit">
            {isLoading ? t('loading') : t('btn.save')}
          </button>
        </div>
      </form>
    </TitleCard>
  );
}
