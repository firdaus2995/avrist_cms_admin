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
import { t } from 'i18next';
import { errorMessageTypeConverter } from '@/utils/logicHelper';
import { baseRedirectAdmin } from '@/constants/common';

const schema = yup.object().shape({
  username: yup.string().required(t('form.login.userid-required') ?? 'User ID is required'),
  password: yup.string().required(t('form.login.password-required') ?? 'Password is required'),
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

  const [login, { isLoading }] = useLoginMutation();

  const handleLoginSubmit = (formData: { username: any; password: any }) => {
    login({ userId: formData.username, password: formData.password })
      .unwrap()
      .then(res => {
        storeDataStorage('accessToken', res.login.accessToken);
        storeDataStorage('refreshToken', res.login.refreshToken);
        storeDataStorage('roles', res.login.roles);

        window.location.assign(baseRedirectAdmin);
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('auth.signin-failed'),
            message: t(`errors.auth.${errorMessageTypeConverter(error?.message, true)}`)}),
        );
      });
  };

  return (
    <>
      <h1 className="font-bold text-2xl my-5 text-dark-purple">{t('auth.login')}</h1>
      <Typography type="body" size="normal" weight="regular" className="text-body-text-2 mb-10">
        {loginDescription}
      </Typography>
      <form onSubmit={handleSubmit(handleLoginSubmit)} className="mx-0 lg:mx-10">
        <Controller
          name="username"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <AuthInput
              key="username"
              label={t('auth.userId')}
              placeholder={t('auth.enter-userId')}
              error={errors.username?.message}
              styleClass="mb-5"
              {...field}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <AuthInput
              key="password"
              label={t('auth.password')}
              placeholder={t('auth.enter-password')}
              error={errors.password?.message}
              {...field}
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
              {t('auth.forgot-password')} ?
            </Typography>
          </Link>
          <button type="submit" className="btn btn-primary btn-wide">
            {isLoading ? t('loading') + '...' : t('auth.login')}
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
