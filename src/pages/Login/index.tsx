import { useLoginMutation } from '../../services/Login/loginApi';
import { storeDataStorage } from '../../utils/sessionStorage';
import BottomAccessories from '../../assets/login/bottom-accessories.svg';
import IconContainer from '../../assets/login/icon-container.svg';
import Logo from '../../assets/Avrist-logo.png';
import LoginIllustrator from '../../assets/login/login-illustrator.svg';
import { Typography } from '../../components/atoms/Typography';
import AuthInput from '../../components/atoms/Input/AuthInput';

export default function Login() {
  const [login] = useLoginMutation();
  const onClickLogin = () => {
    login({ username: 'super', password: 'Password09!' })
      .unwrap()
      .then(res => {
        storeDataStorage('accessToken', res.login.accessToken);
        storeDataStorage('refreshToken', res.login.refreshToken);
        storeDataStorage('roles', res.login.roles);

        window.location.assign('/');
      })
      .catch(err => {
        console.log(err);
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
          <form className="mx-10 sm:mx-0">
            <AuthInput
              label="User Name"
              placeholder="Enter Username"
              error="Invalid username"
              styleClass="mb-5"
            />
            <AuthInput label="Password" placeholder="Enter Password" error="Invalid username" />
            <div className='bg-red'>
              <span className="text-sm ml-2 hover:text-blue-500 cursor-pointer">
                Forgot Password ?
              </span>
            </div>

            <button
              type="submit"
              className="block w-full bg- mt-4 py-2 rounded-2xl text-white font-semibold mb-2">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
