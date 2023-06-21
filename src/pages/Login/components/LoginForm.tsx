import { useState } from 'react';
import { useLoginMutation } from '@/services/Login/loginApi';
import AuthInput from '@/components/atoms/Input/AuthInput';
import { Link } from 'react-router-dom';
import { openToast } from '@/components/atoms/Toast/slice';
import { useAppDispatch } from '@/store';
import { storeDataStorage } from '@/utils/SessionStorage';
import Typography from '@/components/atoms/Typography';

const LoginForm = () => {
  const dispatch = useAppDispatch();

  const [login] = useLoginMutation();
  const [authValue, setAuthValue] = useState({
    username: '',
    password: '',
    errors: { username: '', password: '' },
  });

  const handleUsernameChange = (e: { target: { value: any } }) => {
    setAuthValue({ ...authValue, username: e.target.value });
  };

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
      <h1 className="font-bold text-2xl my-5 text-dark-purple">Login</h1>
      <Typography type="body" size="normal" weight="regular" className="text-body-text-2 mb-10">
        Welcome to Avrist Content Management System, please put your login credentials below to
        start using the app.
      </Typography>
      <form onSubmit={handleLoginSubmit} className="mx-0 lg:mx-10">
        <AuthInput
          key="username"
          label="User Name"
          placeholder="Enter Username"
          error={authValue.errors.username}
          styleClass="mb-5"
          onChange={handleUsernameChange}
          value={authValue.username}
        />
        <AuthInput
          key="password"
          label="Password"
          placeholder="Enter Password"
          error={authValue.errors.password}
          onChange={handlePasswordChange}
          value={authValue.password}
          passwordMode={true}
        />
        <div className="flex flex-col items-end my-10">
          <Link to="/forgot-password">
            <Typography
              type="body"
              size="s"
              weight="regular"
              className="text-primary cursor-pointer mb-8">
              Forgot Password ?
            </Typography>
          </Link>
          <button type="submit" className="btn btn-primary btn-wide">
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
