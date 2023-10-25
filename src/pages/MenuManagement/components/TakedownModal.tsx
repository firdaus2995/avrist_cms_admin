import { useForm, Controller } from 'react-hook-form';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import { openToast } from '@/components/atoms/Toast/slice';
import PaperIcon from '@/assets/paper.svg';
import { TextArea } from '@/components/atoms/Input/TextArea';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { useDeleteMenuMutation } from '@/services/Menu/menuApi';

function trimStringToLength(inputString: string, maxLength: number) {
  if (!inputString || inputString.length === 0) {
    return '';
  }
  if (inputString.length <= maxLength) {
    return inputString;
  }
  return inputString.substring(0, maxLength - 3) + '...';
}

function TakedownModal({ open, onCancel, idDelete }: any) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [deleteMenu] = useDeleteMenuMutation();

  const onSubmit = (data: any) => {
    deleteMenu({ id: idDelete, takedownNote: data.takedownNote })
      .unwrap()
      .then(async (d: any) => {
        reset();
        dispatch(
          openToast({
            type: 'success',
            title: t('user.menu-list.menuList.successDelete'),
            message: d.roleDelete?.message || '',
          }),
        );
        navigate('/menu', { replace: true });
      })
      .catch((err: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.menu-list.menuList.failedDelete'),
            message: trimStringToLength(err?.message, 50),
          }),
        );
      });
  };

  return (
    <ModalConfirm
      open={open}
      cancelAction={() => {
        onCancel();
        reset();
      }}
      modalWidth={600}
      modalHeight={'100%'}
      title={t('user.menu-list.menuList.takedownTitle')}
      titleSize={18}
      cancelTitle={t('user.menu-list.menuList.cancel')}
      submitAction={handleSubmit(onSubmit)}
      submitTitle={t('user.menu-list.menuList.submit')}
      icon={PaperIcon}
      iconSize={26}
      btnSubmitStyle={'bg-secondary-warning border border-tertiary-warning'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full px-10">
          <Controller
            name="takedownNote"
            control={control}
            defaultValue=""
            rules={{ required: `${t('user.menu-list.menuList.takedownRequired')}` }}
            render={({ field }) => (
              <TextArea
                {...field}
                name="TakedownComment"
                labelTitle={t('user.menu-list.menuList.takedownComment')}
                labelRequired
                value={field.value}
                containerStyle="rounded-3xl"
                isError={!!errors?.takedownNote}
                helperText={errors?.takedownNote?.message?.toString() ?? ''}
                onChange={e => {
                  field.onChange(e.target.value);
                }}
                inputWidth={400}
              />
            )}
          />
        </div>
      </form>
    </ModalConfirm>
  );
}

export default TakedownModal;
