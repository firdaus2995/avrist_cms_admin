import { useState } from 'react';
import { useSetNewPasswordMutation } from '@/services/User/userApi';
import AuthInput from '@/components/atoms/Input/AuthInput';
import { useParams, useNavigate } from 'react-router-dom';
import { openToast } from '@/components/atoms/Toast/slice';
import { useAppDispatch } from '@/store';
import Typography from '@/components/atoms/Typography';
import { LoadingCircle } from '@/components/atoms/Loading/loadingCircle';

const NewPasswordForm = () => {
  const dispatch = useAppDispatch();
  const { uuid } = useParams();

  const navigate = useNavigate();

  const [setNewPassword, { isLoading }] = useSetNewPasswordMutation();

  const [authValue, setAuthValue] = useState({
    newPassword: '',
    confirmNewPassword: '',
    errors: { newPassword: '', confirmNewPassword: '' },
  });

  const handleNewPasswordChange = (e: { target: { value: any } }) => {
    setAuthValue({ ...authValue, newPassword: e.target.value });
  };

  const handleConfirmNewPasswordChange = (e: { target: { value: any } }) => {
    setAuthValue({ ...authValue, confirmNewPassword: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Check if username and password are empty
    if (!authValue.newPassword || !authValue.confirmNewPassword) {
      const updatedErrors = {
        newPassword: !authValue.newPassword ? 'This field is required' : '',
        confirmNewPassword: !authValue.confirmNewPassword ? 'This field is required' : '',
      };
      setAuthValue(prevState => ({
        ...prevState,
        errors: updatedErrors,
      }));
      return;
    }

    setNewPassword({ requestId: uuid, newPassword: authValue.newPassword })
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: 'Success!',
            message: 'Your new password successfully saved!',
          }),
        );
        navigate('/', { replace: true });
      })
      .catch((_err: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed',
            message: 'Invalid Url',
          }),
        );
        navigate('/forgot-password', { replace: true });
      });
  };

  return (
    <>
      <h1 className="font-bold text-2xl my-5 text-dark-purple">Create New Password</h1>
      <Typography type="body" size="normal" weight="regular" className="text-body-text-2 mb-10">
        Enter your new password for Avrist Content Management System.
      </Typography>
      <form onSubmit={handleSubmit} className="mx-0 lg:mx-10">
        <AuthInput
          key="password"
          label="New Password"
          placeholder="Enter Password"
          error={authValue.errors.newPassword}
          onChange={handleNewPasswordChange}
          value={authValue.newPassword}
          passwordMode={true}
          styleClass="mb-5"
          labelWidth="basis-1/3"
        />
        <AuthInput
          key="password"
          label="Confirm New Password"
          placeholder="Enter Password"
          error={authValue.errors.confirmNewPassword}
          onChange={handleConfirmNewPasswordChange}
          value={authValue.confirmNewPassword}
          passwordMode={true}
          labelWidth="basis-1/3"
        />
        <div className="flex flex-col items-end my-10">
          <button type="submit" className="btn btn-primary btn-wide">
            {isLoading ? <LoadingCircle className="fill-white" /> : 'Create New Password'}
          </button>
        </div>
      </form>
    </>
  );
};

export default NewPasswordForm;
