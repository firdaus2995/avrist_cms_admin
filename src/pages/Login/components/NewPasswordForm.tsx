import { useState } from 'react';
import { useLoginMutation } from '@/services/Login/loginApi';
import AuthInput from '@/components/atoms/Input/AuthInput';
// import { Link } from 'react-router-dom';
import { openToast } from '@/components/atoms/Toast/slice';
import { useAppDispatch } from '@/store';
import { storeDataStorage } from '@/utils/SessionStorage';
import Typography from '@/components/atoms/Typography';

const NewPasswordForm = (props: any) => {
  const dispatch = useAppDispatch();

  const [login] = useLoginMutation();
  const [authValue, setAuthValue] = useState({
    username: '',
    password: '',
    errors: { username: '', password: '' },
  });

  const handlePasswordChange = (e: { target: { value: any } }) => {
    setAuthValue({ ...authValue, password: e.target.value });
  };

  const handleLoginSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Check if username and password are empty
    if (!authValue.username || !authValue.password) {
      const updatedErrors = {
        username: !authValue.username ? 'This field is required' : '',
        password: !authValue.password ? 'This field is required' : '',
      };
      setAuthValue(prevState => ({
        ...prevState,
        errors: updatedErrors,
      }));
      return;
    }

    login({ userId: authValue.username, password: authValue.password })
      .unwrap()
      .then(res => {
        storeDataStorage('accessToken', res.login.accessToken);
        storeDataStorage('refreshToken', res.login.refreshToken);
        storeDataStorage('roles', res.login.roles);

        window.location.assign('/');
      })
      .catch(err => {
        setAuthValue(prevState => ({
          ...prevState,
          errors: { username: '', password: 'Sign-in failed' },
        }));
        console.log('Sign-in failed:', err);
        // Handle sign-in failure here
        dispatch(
          openToast({
            type: 'error',
            title: 'Sign-in Failed',
            message: 'Sign-in failed',
          }),
        );
      });
  };

  return (
    <>
      <h1 className="font-bold text-2xl my-5 text-dark-purple">Create New Password</h1>
      <Typography type="body" size="normal" weight="regular" className="text-body-text-2 mb-10">
        Enter your new password for Avrist Content Management System.
      </Typography>
      <form onSubmit={handleLoginSubmit} className="mx-0 lg:mx-10">
        <AuthInput
          key="password"
          label="New Password"
          placeholder="Enter Password"
          error={authValue.errors.password}
          onChange={handlePasswordChange}
          value={authValue.password}
          passwordMode={true}
          styleClass="mb-5"
          labelWidth="basis-1/3"
        />
        <AuthInput
          key="password"
          label="Confirm New Password"
          placeholder="Enter Password"
          error={authValue.errors.password}
          onChange={handlePasswordChange}
          value={authValue.password}
          passwordMode={true}
          labelWidth="basis-1/3"
        />
        <div className="flex flex-col items-end my-10">
          <button type="submit" className="btn btn-primary btn-wide">
            Create New Password
          </button>
        </div>
      </form>
    </>
  );
};

export default NewPasswordForm;
