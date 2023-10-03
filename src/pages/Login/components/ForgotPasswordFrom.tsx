import { useState } from 'react';
import AuthInput from '@/components/atoms/Input/AuthInput';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetForgotPasswordMutation } from '@/services/User/userApi';
import { openToast } from '@/components/atoms/Toast/slice';
import { useAppDispatch } from '@/store';
import Typography from '@/components/atoms/Typography';
import BackArrowLeft from '@/assets/back-arrow-left.svg';
import WarningRed from '@/assets/warning-red.svg';
import { LoadingCircle } from '@/components/atoms/Loading/loadingCircle';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

const ResetPasswordForm = () => {
  const dispatch = useAppDispatch();
  const { state: pageState } = useLocation();
  const [getForgotPassword, { isLoading }] = useGetForgotPasswordMutation();
  const [resetPasswordValue, setResetPasswordValue] = useState({
    email: '',
    errors: { email: '' },
  });

  // GO BACK
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const handleResetPasswordChange = (e: { target: { value: any } }) => {
    setResetPasswordValue({ ...resetPasswordValue, email: e.target.value });
  };

  const handleForgotPasswordSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!resetPasswordValue.email) {
      const updatedErrors = {
        email: !resetPasswordValue.email ? t('form.forgot-password.required') : '',
      };
      setResetPasswordValue(prevState => ({
        ...prevState,
        errors: updatedErrors,
      }));
      return;
    }

    getForgotPassword({ email: resetPasswordValue.email })
      .unwrap()
      .then((_res: any) => {
        setIsVerify(true);
        dispatch(
          openToast({
            type: 'success',
            title: t('auth.reset-password'),
            message: t('auth.reset-success'),
          }),
        );
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('auth.failed-reset'),
            message: t('auth.failed-reset'),
          }),
        );
      });
  };

  const [isVerify, setIsVerify] = useState(false);

  return (
    <>
      <h1 className="font-bold text-2xl my-5 text-dark-purple">
        {!isVerify ? t('auth.forgot-password') : t('auth.verify-email')}
      </h1>
      {pageState?.resetFailed && (
        <div className="flex flex-row p-2 bg-toast-error border-2 border-toast-error-border min-h-min-content mb-5">
          <img src={WarningRed} className="mr-4" />
          <Typography type="body" size="s" weight="regular" className="text-body-text-2">
            {t('auth.link-not-valid')}
          </Typography>
        </div>
      )}

      <Typography type="body" size="normal" weight="regular" className="text-body-text-2 mb-10">
        {!isVerify ? (
          t('auth.enter-email-to-reset-password')
        ) : (
          <Trans i18nKey="auth.success-send-email" values={{ email: resetPasswordValue.email }} />
        )}
      </Typography>
      {isVerify && (
        <Typography type="body" size="normal" weight="regular" className="text-body-text-2 mb-10">
          <div className="flex flex-row">
            {t('auth.not-receive-email')}
            {isLoading ? (
              <LoadingCircle className="ml-2" />
            ) : (
              <strong
                onClick={handleForgotPasswordSubmit}
                className="ml-2 text-primary cursor-pointer">
                {t('auth.resend')}
              </strong>
            )}
          </div>
        </Typography>
      )}
      <form onSubmit={handleForgotPasswordSubmit} className="mx-0 lg:mx-10">
        {!isVerify && (
          <AuthInput
            key="email"
            label={t('auth.email-address')}
            placeholder={t('auth.enter-email')}
            error={resetPasswordValue.errors.email}
            styleClass="mb-5"
            onChange={handleResetPasswordChange}
            value={resetPasswordValue.email}
          />
        )}
        <div className="flex flex-row justify-between my-10">
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              goBack();
            }}
            className="btn btn-ghost font-normal text-body-text-3">
            <img src={BackArrowLeft} className="mr-2" />
            {t('auth.back-to-login')}
          </button>
          {!isVerify && (
            <button type="submit" className="btn btn-primary btn-wide">
              {isLoading ? <LoadingCircle className="fill-white" /> : t('auth.reset')}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default ResetPasswordForm;
