import { useEffect, useState } from 'react';
import { useLoginMutation } from '@/services/Login/loginApi';
import AuthInput from '@/components/atoms/Input/AuthInput';
import { Link } from 'react-router-dom';
import { openToast } from '@/components/atoms/Toast/slice';
import { useAppDispatch } from '@/store';
import { storeDataStorage } from '@/utils/SessionStorage';
import Typography from '@/components/atoms/Typography';
import { useGetCmsEntityLoginDescriptionQuery } from '@/services/Config/configApi';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const LoginForm = () => {
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loginDescription, setLoginDescription] = useState('');
  const fetchLoginDescriptionQuery = useGetCmsEntityLoginDescriptionQuery({});
  const { data: dataLoginDescription } = fetchLoginDescriptionQuery;

  useEffect(() => {
    if (dataLoginDescription?.getConfig) {
      setLoginDescription(dataLoginDescription?.getConfig.value);
    }
  }, [dataLoginDescription]);

  const [login] = useLoginMutation();

  const handleLoginSubmit = (formData: { username: any; password: any }) => {
    login({ userId: formData.username, password: formData.password })
      .unwrap()
      .then(res => {
        storeDataStorage('accessToken', res.login.accessToken);
        storeDataStorage('refreshToken', res.login.refreshToken);
        storeDataStorage('roles', res.login.roles);

        window.location.assign('/');
      })
      .catch(() => {
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
        {loginDescription}
      </Typography>
      <form onSubmit={handleSubmit(handleLoginSubmit)} className="mx-0 lg:mx-10">
        <Controller
          name="username" // Name should match the field name in the validation schema
          control={control}
          defaultValue="" // Set the initial value of the field
          render={({ field }) => (
            <AuthInput
              key="username"
              label="User Name"
              placeholder="Enter Username"
              error={errors.username?.message} // Use the 'errors' object from react-hook-form
              styleClass="mb-5"
              {...field} // Spread the field props into the input component
            />
          )}
        />
        <Controller
          name="password" // Name should match the field name in the validation schema
          control={control}
          defaultValue="" // Set the initial value of the field
          render={({ field }) => (
            <AuthInput
              key="password"
              label="Password"
              placeholder="Enter Password"
              error={errors.password?.message} // Use the 'errors' object from react-hook-form
              {...field} // Spread the field props into the input component
              passwordMode={true}
            />
          )}
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
