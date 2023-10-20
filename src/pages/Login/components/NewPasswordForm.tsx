import { useSetNewPasswordMutation, useCheckResetPasswordUrlQuery } from '@/services/User/userApi';
import AuthInput from '@/components/atoms/Input/AuthInput';
import { useParams, useNavigate } from 'react-router-dom';
import { openToast } from '@/components/atoms/Toast/slice';
import { useAppDispatch } from '@/store';
import Typography from '@/components/atoms/Typography';
import { LoadingCircle } from '@/components/atoms/Loading/loadingCircle';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { t } from 'i18next';
import { useEffect } from 'react';

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required(t('user.new-password-form.newPasswordRequiredError') ?? '')
    .test(
      'empty-check',
      t('user.new-password-form.invalidPassword') ?? '',
      newPassword => newPassword.length > 0,
    )
    .matches(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
      t('user.new-password-form.invalidPassword') ?? '',
    ),
  confirmNewPassword: yup
    .string()
    .required(t('user.new-password-form.newPasswordRequiredError') ?? '')
    .test(
      'empty-check',
      t('user.new-password-form.invalidPassword') ?? '',
      confirmNewPassword => confirmNewPassword.length > 0,
    )
    .matches(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
      t('user.new-password-form.invalidPassword') ?? '',
    )
    .oneOf([yup.ref('newPassword')], t('user.new-password-form.passwordMismatchError') ?? ''),
});

const NewPasswordForm = () => {
  const dispatch = useAppDispatch();
  const { token } = useParams();

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [setNewPassword, { isLoading }] = useSetNewPasswordMutation();
  const { data: urlResponse, isError } = useCheckResetPasswordUrlQuery(
    {
      requestId: token,
    },
    { skip: !token },
  );

  useEffect(() => {
    if (urlResponse && !isError) {
      if (!urlResponse.validateResetPasswordUrl.result) navigate('/forgot-password', { replace: true, state: { resetFailed: true } });
    } else {
      navigate('/forgot-password', { replace: true, state: { resetFailed: true } });
    }
  }, [urlResponse, isError]);

  const handleResetSubmit = (formData: { newPassword: any }) => {
    const { newPassword } = formData;

    setNewPassword({ requestId: token, newPassword })
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('user.new-password-form.successToastTitle'),
            message: t('user.new-password-form.successToastMessage'),
          }),
        );
        navigate('/', { replace: true });
      })
      .catch((_err: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.new-password-form.errorToastTitle'),
            message: t('user.new-password-form.errorToastMessage'),
          }),
        );
        navigate('/forgot-password', { replace: true, state: { resetFailed: true } });
      });
  };

  return (
    <>
      <h1 className="font-bold text-2xl my-5 text-dark-purple">
        {t('user.new-password-form.createNewPasswordTitle')}
      </h1>
      <Typography type="body" size="normal" weight="regular" className="text-body-text-2 mb-10">
        {t('user.new-password-form.createNewPasswordDescription')}
      </Typography>
      <form onSubmit={handleSubmit(handleResetSubmit)} className="mx-0 lg:mx-10">
        <Controller
          name="newPassword"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <AuthInput
              key="newPassword"
              label={t('user.new-password-form.newPasswordLabel')}
              placeholder={t('user.new-password-form.newPasswordPlaceholder')}
              error={errors.newPassword?.message}
              passwordMode={true}
              styleClass="mb-5"
              labelWidth="basis-1/3"
              isStatic={true}
              {...field}
            />
          )}
        />
        <Controller
          name="confirmNewPassword"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <AuthInput
              key="confirmNewPassword"
              label={t('user.new-password-form.confirmNewPasswordLabel')}
              placeholder={t('user.new-password-form.confirmNewPasswordPlaceholder')}
              error={errors.confirmNewPassword?.message}
              passwordMode={true}
              labelWidth="basis-1/3"
              isStatic={true}
              {...field}
            />
          )}
        />

        <div className="flex flex-col items-end my-10">
          <button
            type="submit"
            className="btn btn-primary btn-wide"
            disabled={JSON.stringify(errors) !== '{}'}>
            {isLoading ? (
              <LoadingCircle className="fill-white" />
            ) : (
              t('user.new-password-form.createNewPasswordButton')
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default NewPasswordForm;
