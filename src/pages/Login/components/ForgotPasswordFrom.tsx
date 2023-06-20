import { useState } from 'react';
import AuthInput from '@/components/atoms/Input/AuthInput';
import { Link } from 'react-router-dom';
import { useGetForgotPasswordMutation } from '@/services/User/userApi';
import { openToast } from '@/components/atoms/Toast/slice';
import { useAppDispatch } from '@/store';
import Typography from '@/components/atoms/Typography';
import BackArrowLeft from '@/assets/back-arrow-left.svg';
import { LoadingCircle } from '../../../components/atoms/Loading/loadingCircle';

const ResetPasswordForm = (props: any) => {
  const dispatch = useAppDispatch();

  const [getForgotPassword, { isLoading }] = useGetForgotPasswordMutation();
  const [resetPasswordValue, setResetPasswordValue] = useState({
    email: '',
    errors: { email: '' },
  });

  const handleResetPasswordChange = (e: { target: { value: any } }) => {
    setResetPasswordValue({ ...resetPasswordValue, email: e.target.value });
  };

  const handleForgotPasswordSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!resetPasswordValue.email) {
      const updatedErrors = {
        email: !resetPasswordValue.email ? 'This field is required' : '',
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
            title: 'Reset Password',
            message: 'Reset password email sent successfully',
          }),
        );
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed to send reset email',
            message: 'Failed to send reset email',
          }),
        );
      });
  };

  const [isVerify, setIsVerify] = useState(false);

  return (
    <>
      <h1 className="font-bold text-2xl my-5 text-dark-purple">
        {!isVerify ? `Forgot Password` : `Verify Email`}
      </h1>
      <Typography type="body" size="normal" weight="regular" className="text-body-text-2 mb-10">
        {!isVerify ? (
          'Enter your email address to reset your password.'
        ) : (
          <>
            An Email has been sent to your email address <strong>{resetPasswordValue.email}</strong>
            . Please click on that link to verify your email address.
          </>
        )}
      </Typography>
      {isVerify && (
        <Typography type="body" size="normal" weight="regular" className="text-body-text-2 mb-10">
          <div className="flex flex-row">
            Didn’t receive the email?
            {isLoading ? (
              <LoadingCircle classname="ml-2" />
            ) : (
              <strong
                onClick={handleForgotPasswordSubmit}
                className="ml-2 text-primary cursor-pointer">
                Resend
              </strong>
            )}
          </div>
        </Typography>
      )}
      <form onSubmit={handleForgotPasswordSubmit} className="mx-0 lg:mx-10">
        {!isVerify && (
          <AuthInput
            key="email"
            label="Email Address"
            placeholder="Enter your email"
            error={resetPasswordValue.errors.email}
            styleClass="mb-5"
            onChange={handleResetPasswordChange}
            value={resetPasswordValue.email}
          />
        )}
        <div className="flex flex-row justify-between my-10">
          <Link to="/login">
            <button type="submit" className="btn btn-ghost font-normal text-body-text-3">
              <img src={BackArrowLeft} className="mr-2" />
              Back To Login
            </button>
          </Link>
          {!isVerify && (
            <button type="submit" className="btn btn-primary btn-wide">
              {isLoading ? <LoadingCircle classname="fill-white" /> : 'Reset'}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default ResetPasswordForm;
