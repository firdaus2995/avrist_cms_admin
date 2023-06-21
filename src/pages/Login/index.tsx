import { useLocation } from 'react-router-dom';
import { LeftContent } from './components/LeftContent';
import LoginForm from './components/LoginForm';
import ResetPasswordForm from './components/ForgotPasswordFrom';
import NewPasswordForm from './components/NewPasswordForm';

export default function Login() {
  const location = useLocation();
  const currentRoute = location.pathname;
  const isLoginScreen = currentRoute === '/login';
  const isForgotPasswordScreen = currentRoute === '/forgot-password';
  const isNewPasswordScreen = currentRoute.startsWith('/forgot-password/');

  return (
    <div className="h-screen md:flex">
      {/* LEFT CONTENT */}
      <LeftContent />

      {/* RIGHT CONTENT */}
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <div className="bg-white mx-16 w-full">
          {isLoginScreen && <LoginForm />}
          {isForgotPasswordScreen && <ResetPasswordForm />}
          {isNewPasswordScreen && <NewPasswordForm />}
        </div>
      </div>
    </div>
  );
}
