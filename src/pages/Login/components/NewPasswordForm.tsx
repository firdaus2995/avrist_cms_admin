import { useState } from 'react';
import { useSetNewPasswordMutation } from '@/services/User/userApi';
import AuthInput from '@/components/atoms/Input/AuthInput';
import { useParams, useNavigate } from 'react-router-dom';
import { openToast } from '@/components/atoms/Toast/slice';
import { useAppDispatch } from '@/store';
import Typography from '@/components/atoms/Typography';
import { LoadingCircle } from '@/components/atoms/Loading/loadingCircle';
import { t } from 'i18next';

const NewPasswordForm = () => {
  const dispatch = useAppDispatch();
  const { token } = useParams();

  const navigate = useNavigate();

  const [setNewPassword, { isLoading }] = useSetNewPasswordMutation();

  const [authValue, setAuthValue] = useState({
    newPassword: '',
    confirmNewPassword: '',
    errors: { newPassword: '', confirmNewPassword: '' },
  });

  const handleNewPasswordChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setAuthValue(prevState => ({
      ...prevState,
      newPassword: value,
      errors: { ...prevState.errors, newPassword: '' },
    }));
  };

  const handleConfirmNewPasswordChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setAuthValue(prevState => ({
      ...prevState,
      confirmNewPassword: value,
      errors: { ...prevState.errors, confirmNewPassword: '' },
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const { newPassword, confirmNewPassword } = authValue;

    // Check if newPassword and confirmNewPassword are empty
    if (!newPassword || !confirmNewPassword) {
      const updatedErrors = {
        newPassword: !newPassword ? t('user.new-password-form.newPasswordRequiredError') : '',
        confirmNewPassword: !confirmNewPassword ? t('user.new-password-form.newPasswordRequiredError') : '',
      };
      setAuthValue(prevState => ({
        ...prevState,
        errors: updatedErrors,
      }));
      return;
    }

    // Check if newPassword and confirmNewPassword match
    if (newPassword !== confirmNewPassword) {
      const updatedErrors = {
        newPassword: t('user.new-password-form.passwordMismatchError'),
        confirmNewPassword: t('user.new-password-form.passwordMismatchError'),
      };
      setAuthValue(prevState => ({
        ...prevState,
        errors: updatedErrors,
      }));
      return;
    }

    setNewPassword({ requestId: token, newPassword })
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('user.new-password-form.successToastTitle'),
            message: t('user.new-password-form.successToastMessage'),
          })
        );
        navigate('/', { replace: true });
      })
      .catch((_err: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.new-password-form.errorToastTitle'),
            message: t('user.new-password-form.errorToastMessage'),
          })
        );
        navigate('/forgot-password', { replace: true, state: { resetFailed: true } });
      });
  };

  return (
    <>
      <h1 className="font-bold text-2xl my-5 text-dark-purple">{t('user.new-password-form.createNewPasswordTitle')}</h1>
      <Typography type="body" size="normal" weight="regular" className="text-body-text-2 mb-10">
        {t('user.new-password-form.createNewPasswordDescription')}
      </Typography>
      <form onSubmit={handleSubmit} className="mx-0 lg:mx-10">
        <AuthInput
          key="password"
          label={t('user.new-password-form.newPasswordLabel')}
          placeholder={t('user.new-password-form.newPasswordPlaceholder')}
          error={authValue.errors.newPassword}
          onChange={handleNewPasswordChange}
          value={authValue.newPassword}
          passwordMode={true}
          styleClass="mb-5"
          labelWidth="basis-1/3"
        />
        <AuthInput
          key="confirmPassword"
          label={t('user.new-password-form.confirmNewPasswordLabel')}
          placeholder={t('user.new-password-form.confirmNewPasswordPlaceholder')}
          error={authValue.errors.confirmNewPassword}
          onChange={handleConfirmNewPasswordChange}
          value={authValue.confirmNewPassword}
          passwordMode={true}
          labelWidth="basis-1/3"
        />
        <div className="flex flex-col items-end my-10">
          <button type="submit" className="btn btn-primary btn-wide">
            {isLoading ? <LoadingCircle className="fill-white" /> : t('user.new-password-form.createNewPasswordButton')}
          </button>
        </div>
      </form>
    </>
  );
};

export default NewPasswordForm;
