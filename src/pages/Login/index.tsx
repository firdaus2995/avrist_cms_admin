import { useState } from 'react';
import { useLoginMutation } from '../../services/Login/loginApi';
import { storeDataStorage } from '../../utils/SessionStorage';
import BottomAccessories from '../../assets/login/bottom-accessories.svg';
import IconContainer from '../../assets/login/icon-container.svg';
import Logo from '../../assets/Avrist-logo.png';
import LoginIllustrator from '../../assets/login/login-illustrator.svg';
import { Typography } from '../../components/atoms/Typography';
import AuthInput from '../../components/atoms/Input/AuthInput';

export default function Login() {
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
  const onClickLogin = (e: { preventDefault: () => void }) => {
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

    login({ username: authValue.username, password: authValue.password })
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
      {/* RIGHT CONTENT - LOGIN FORM */}
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <div className="bg-white mx-16">
          <h1 className="font-bold text-2xl my-5 text-dark-purple">Login</h1>
          <Typography
            type="body"
            size="normal"
            weight="regular"
            styleClass="text-body-text-2 mb-10">
            Welcome to Avrist Content Management System, please put your login credentials below to
            start using the app.
          </Typography>
          <form className="mx-0 lg:mx-10">
            <AuthInput
              label="User Name"
              placeholder="Enter Username"
              error={authValue.errors.username}
              styleClass="mb-5"
              onChange={handleUsernameChange}
              value={authValue.username}
            />
            <AuthInput
              label="Password"
              placeholder="Enter Password"
              error={authValue.errors.password}
              onChange={handlePasswordChange}
              value={authValue.password}
              passwordMode={true}
            />
            <div className="flex flex-col items-end my-12">
              <Typography
                type="body"
                size="s"
                weight="regular"
                styleClass="text-primary cursor-pointer mb-8">
                Forgot Password ?
              </Typography>
              <button onClick={onClickLogin} className="btn btn-primary btn-wide">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
