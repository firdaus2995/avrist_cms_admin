import { useState } from 'react';
import { useLoginMutation } from '@/services/Login/loginApi';
import { storeDataStorage } from '@/utils/SessionStorage';
import BottomAccessories from '@/assets/login/bottom-accessories.svg';
import IconContainer from '@/assets/login/icon-container.svg';
import Logo from '@/assets/Avrist-logo.png';
import LoginIllustrator from '@/assets/login/login-illustrator.svg';
import BackArrowLeft from '@/assets/back-arrow-left.svg';
import Typography from '@/components/atoms/Typography';
import AuthInput from '@/components/atoms/Input/AuthInput';
import { Link, useLocation } from 'react-router-dom';

export default function Login() {
  const location = useLocation();
  const currentRoute = location.pathname;
  const isLoginScreen = currentRoute === '/login';
  const isForgotPasswordScreen = currentRoute === '/forgot-password';

  const [login] = useLoginMutation();
  const [authValue, setAuthValue] = useState({
    username: '',
    password: '',
    errors: { username: '', password: '' },
  });
  const handleUsernameChange = (e: { target: { value: string } }) => {
    setAuthValue({ ...authValue, username: e.target.value });
  };

  const handlePasswordChange = (e: { target: { value: string } }) => {
    setAuthValue({ ...authValue, password: e.target.value });
  };

  // ON LOGIN BUTTON PRESS
  const handleLoginSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Check if username and password are empty
    if (!authValue.username || !authValue.password) {
      const updatedErrors = {
        username: !authValue.username ? 'Please enter your username' : '',
        password: !authValue.password ? 'Please enter your password' : '',
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
      });
  };

  // ON RESET PASSWORD BUTTON PRESS
  const handleForgotPasswordSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  return (
    <div className="h-screen md:flex">
      {/* LEFT CONTENT */}
      <div className="relative overflow-hidden md:flex w-1/2 bg-light-purple-2 i justify-around items-center hidden">
        <div>
          <img src={LoginIllustrator} />
        </div>
        <div className="absolute -bottom-0 -right-0">
          <img src={BottomAccessories} />
        </div>
        <div className="absolute -top-0 -left-0 z-1">
          <img src={IconContainer} />
          <div className="absolute top-8 left-8 z-2">
            <img src={Logo} />
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT - LOGIN FORM / FORGOT PASSWORD */}
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        {/* LOGIN FORM */}
        <div className="bg-white mx-16 w-full">
          {isLoginScreen && <h1 className="font-bold text-2xl my-5 text-dark-purple">Login</h1>}
          {isForgotPasswordScreen && (
            <h1 className="font-bold text-2xl my-5 text-dark-purple">Forgot Password</h1>
          )}

          {isLoginScreen && (
            <Typography
              type="body"
              size="normal"
              weight="regular"
              className="text-body-text-2 mb-10">
              Welcome to Avrist Content Management System, please put your login credentials below
              to start using the app.
            </Typography>
          )}
          {isForgotPasswordScreen && (
            <Typography
              type="body"
              size="normal"
              weight="regular"
              className="text-body-text-2 mb-10">
              Enter your email address to reset your password
            </Typography>
          )}

          {isLoginScreen && (
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
          )}
          {isForgotPasswordScreen && (
            <form onSubmit={handleForgotPasswordSubmit} className="mx-0 lg:mx-10">
              <AuthInput
                key="email"
                label="Email Address"
                placeholder="Enter your email"
                error={authValue.errors.username}
                styleClass="mb-5"
                onChange={handleUsernameChange}
                value={authValue.username}
              />
              <div className="flex flex-row justify-between my-10">
                <Link to="/login">
                  <button type="submit" className="btn btn-ghost font-normal text-body-text-3">
                    <img src={BackArrowLeft} className="mr-2" />
                    Back To Login
                  </button>
                </Link>
                <button type="submit" className="btn btn-primary btn-wide">
                  Reset
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
