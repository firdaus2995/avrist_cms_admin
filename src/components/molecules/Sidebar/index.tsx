import React, { useEffect, useState } from 'react';
import { t } from 'i18next';
import { To, useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import Menu from '@/assets/menu.png';
import LogoutIcon from '@/assets/sidebar/Logout-icon.png';
import EditIcon from '@/assets/sidebar/Edit-user.png';
import ProfilePhoto from '@/assets/Profile-photo.png';
import WarningOrange from '@/assets/warning-orange.svg';
import CloseIcon from '@/assets/close.png';
import FileUploaderAvatar from '../FileUploaderAvatar';
import Modal from '@/components/atoms/Modal';
import ModalConfirm from '../ModalConfirm';
import { clearAuth } from '@/services/Login/slice';
import { sidebarList } from './list';
import { InputText } from '@/components/atoms/Input/InputText';
import { InputPassword } from '@/components/atoms/Input/InputPassword';
import { useChangePasswordUserProfileMutation, useEditUserProfileMutation, useGetUserProfileQuery } from '../../../services/User/userApi';
import { store, useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import { getCredential, removeCredential } from '@/utils/Credential';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

interface ISidebar {
  open: boolean;
  setOpen: (t: boolean) => void;
}
export const Sidebar: React.FC<ISidebar> = props => {
  const { open, setOpen } = props;
  return (
    <div className={`${open ? 'w-[268px]' : 'w-16'} h-screen fixed z-30 ease-in-out duration-300`}>
      <HeadSidebar open={open} setOpen={setOpen} />
      <MenuSidebar open={open} setOpen={setOpen} />
    </div>
  );
};

interface IHeadSidebar extends ISidebar {}
const HeadSidebar: React.FC<IHeadSidebar> = props => {
  const { open, setOpen } = props;

  return (
    <div className="flex items-center h-[72px] gap-[14px] pl-[18px]">
      <img
        role="button"
        onClick={() => {
          setOpen(!open);
        }}
        src={Menu}
        alt="Menu"
        className="w-6"
      />
      {/* <img className={`w-[160px] h-[31px] ${open ? 'visible' : 'hidden'}`} src={ReactLogo} /> */}
    </div>
  );
};

interface IMenuSidebar extends ISidebar {}
const MenuSidebar: React.FC<IMenuSidebar> = ({ open }) => {
  const token = getCredential().accessToken;
  const footerList = [
    {
      id: 98,
      title: t('user.edit-profile.title'),
      icon: EditIcon,
      bordered: true,
    },
    {
      id: 99,
      title: 'Logout',
      icon: LogoutIcon,
    },
  ];

  const schema = yup.object().shape({
    currentPassword: yup
      .string()
      .required(t('user.new-password-form.newPasswordRequiredError') ?? ''),
    newPassword: yup
      .string()
      .required(t('user.new-password-form.newPasswordRequiredError') ?? '')
      .test(
        'empty-check',
        t('user.new-password-form.invalidPassword') ?? '',
        newPassword => newPassword.length > 0,
      )
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={};':"/|,.<>?~[\]`])/,
        t('user.new-password-form.invalidPassword') ?? '',
      ),
    confirmNewPassword: yup
      .string()
      .required(t('user.new-password-form.newPasswordRequiredError') ?? '')
      .test(
        'empty-check',
        t('user.new-password-form.invalidPassword') ?? '',
        confirmNewPassword => confirmNewPassword.length > 0,
      )
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={};':"/|,.<>?~[\]`])/,
        t('user.new-password-form.invalidPassword') ?? '',
      ),
  });

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    reValidateMode: 'onSubmit',
  });

  const {
    control: controlYup,
    setValue: setValueYup,
    getValues: getValuesYup,
    handleSubmit: handleSubmitYup,
    reset: resetYup,
    formState: { errors: errorsYup },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const roles = store.getState().loginSlice.roles;
  const baseUrl = import.meta.env.VITE_API_URL;

  const [openedTab, setOpenedTab] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(1);
  const [sidebarAvatar, setSidebarAvatar] = useState(null);
  // EDIT PROFILE
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [role, setRole] = useState('');
  // CHANGE PASSWORD
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(false);
  // LOGOUT
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  // RTK USER PROFILE
  const fetchUserDetailQuery = useGetUserProfileQuery({});
  const { data: dataProfile, refetch: refetchDataProfile } = fetchUserDetailQuery;

  // RTK EDIT PROFILE
  const [editProfile, { isLoading: isLoadingEditProfileModal }] = useEditUserProfileMutation();

  // RTK CHANGE PASSWORD PROFILE
  const [changePassword, { isLoading: isLoadingChangePasswordProfileModal }] =
    useChangePasswordUserProfileMutation();

  const [isHovering, setIsHovering] = useState(false);
  const [dataHover, setDataHover] = useState<any>([]);

  const handleMouseOver = (val: any) => {
    setIsHovering(true);
    setDataHover(val);
  };

  const getImage = async (img: any) => {
    await fetch(`${baseUrl}/files/get/${img}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async response => await response.blob())
      .then(blob => {
        if (blob?.size > 0) {
          const objectUrl: any = URL.createObjectURL(blob);
          setSidebarAvatar(objectUrl);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!errorsYup?.currentPassword) {
      setConfirmNewPasswordError(false);
    }
  }, [getValuesYup().confirmNewPassword]);

  useEffect(() => {
    const pathName = location.pathname;

    for (const parentItem of sidebarList) {
      if (parentItem?.list) {
        for (const childItem of parentItem?.list) {
          if (childItem?.path === pathName || `/${pathName.split('/')[1]}` === childItem?.path) {
            setOpenedTab([`Tab_${parentItem.id}`]);
            setActiveTab(childItem.id);
            return;
          }
        }
      } else {
        if (parentItem?.path === pathName || `/${pathName.split('/')[1]}` === parentItem?.path) {
          setActiveTab(parentItem.id);
          return;
        }
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (dataProfile) {
      setValue('fullName', dataProfile?.userProfile?.fullName);
      setValue('avatar', dataProfile?.userProfile?.profilePicture);
      setValue('email', dataProfile?.userProfile?.email);
      setRole(dataProfile?.userProfile?.role?.name);
      if (
        dataProfile?.userProfile?.profilePicture !== null ||
        dataProfile?.userProfile?.profilePicture !== ''
      ) {
        void getImage(dataProfile?.userProfile?.profilePicture);
      }
    }
  }, [JSON.stringify(dataProfile)]);

  const listTabHandler = (e: string) => {
    if (openedTab.includes(e)) {
      const filtered = openedTab.filter(val => val !== e);
      setOpenedTab(filtered);
    } else {
      setOpenedTab(val => [...val, e]);
    }
  };

  const handlerCancel = () => {
    setOpenEditProfileModal(false);
    setOpenChangePasswordModal(false);
    setConfirmNewPasswordError(false);
    setValueYup('currentPassword', '');
    setValueYup('newPassword', '');
    setValueYup('confirmNewPassword', '');
    setValue('avatar', dataProfile?.userProfile?.profilePicture);
    setValue('fullName', dataProfile?.userProfile?.fullName);
    setValue('email', dataProfile?.userProfile?.email);
  };

  const handlerActionLink = (e: any) => {
    e.preventDefault();
    setOpenEditProfileModal(false);
    setTimeout(() => {
      setOpenChangePasswordModal(true);
    }, 50);
  };

  const submitEditProfile = () => {
    const formData = getValues();

    const payload = {
      profilePicture: formData.avatar,
      fullName: formData.fullName,
    };
    editProfile(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('user.edit-profile.success-msg', { name: payload.fullName }),
          }),
        );
        handlerCancel();
        refetchDataProfile();
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t('user.edit-profile.failed-msg', { name: payload.fullName }),
          }),
        );
      });
  };

  const submitChangePassword = () => {
    if (getValuesYup().confirmNewPassword !== getValuesYup().newPassword) {
      setConfirmNewPasswordError(true);
    } else {
      setConfirmNewPasswordError(false);

      const payload = {
        oldPassword: getValuesYup().currentPassword,
        newPassword: getValuesYup().newPassword,
      };
      changePassword(payload)
        .unwrap()
        .then(() => {
          dispatch(
            openToast({
              type: 'success',
              title: t('toast-success'),
              message: t('user.change-password.success-msg', { name: getValues().fullName }),
            }),
          );
          handlerCancel();
        })
        .catch((error: any) => {
          dispatch(
            openToast({
              type: 'error',
              title: t('toast-failed'),
              message: t(`errors.edit-profile.${errorMessageTypeConverter(error.message, true)}`),
            }),
          );
        });
    }
  };

  const handeLogout = () => {
    // LOGOUT
    setActiveTab(99);
    removeCredential();
    dispatch(clearAuth());
  };

  const renderHeader = () => {
    return (
      <div className={`flex flex-col items-center justify-center my-5 ${open ? 'w-[95%]' : ''}`}>
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          {sidebarAvatar ? (
            <div
              className="w-11 h-11 rounded-full bg-[#5E217C] bg-cover"
              style={{ backgroundImage: `url(${sidebarAvatar})` }}></div>
          ) : (
            <div
              className="w-11 h-11 rounded-full bg-[#5E217C] bg-cover"
              style={{ backgroundImage: `url(${ProfilePhoto})` }}></div>
          )}
        </div>
        {open && (
          <div className="text-white flex flex-col mt-2 items-center justify-center">
            <p className="font-bold">{getValues().fullName}</p>
            <p>{role}</p>
          </div>
        )}
      </div>
    );
  };

  const renderListMenu = () => {
    return (
      <div className="border-b pb-5">
        {sidebarList.map((val: any) => {
          const hasRole = val.role && roles?.includes(val.role);

          // Periksa apakah elemen memiliki list dan elemen-elemen dalam listnya memiliki role yang sesuai
          const hasList = val.list?.some(
            (item: { role: any }) => item.role && roles?.includes(item.role),
          );

          if (hasRole || hasList) {
            return (
              <div key={val.id}>
                <div
                  role="button"
                  onMouseOver={() => {
                    handleMouseOver(val);
                  }}
                  onClick={() => {
                    val.list ? listTabHandler(`Tab_${val.id}`) : setActiveTab(val.id);
                    if (val.path) navigate(val.path);
                  }}
                  className={`${activeTab === val.id ? 'bg-[#9B86BA]' : ''} ${
                    open ? 'justify-between m-2 w-[95%]' : 'justify-center m-3'
                  } flex flex-row p-2 rounded-xl items-center hover:bg-[#9B86BA]`}>
                  <div className="flex flex-row">
                    <img src={val.icon} alt={`Menu_${val.id}`} className="w-4 h-4" />
                    {open && (
                      <p
                        className={`${
                          activeTab === val.id ? 'font-bold' : 'font-base'
                        } text-white text-sm ml-4`}>
                        {val.title}
                      </p>
                    )}
                  </div>
                  {val.list && open ? (
                    openedTab.includes(`Tab_${val.id}`) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-white">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 15.75l7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-white">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    )
                  ) : null}
                </div>
                {!open && isHovering && val.list && dataHover.id === val.id && (
                  <div className="p-4 w-[25vh] flex flex-col gap-4 bg-light-purple absolute ml-[100%] mt-[-75%] rounded-lg">
                    {dataHover?.list.map(
                      (value: {
                        role: any;
                        path: To;
                        id: React.Key | null | undefined;
                        title:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                          | React.ReactFragment
                          | React.ReactPortal
                          | null
                          | undefined;
                      }) =>
                        roles?.includes(value?.role) && (
                          <div
                            role="button"
                            onClick={() => {
                              setIsHovering(false);
                              navigate(value.path);
                            }}
                            key={value.id}
                            className="text-xs font-bold text-bright-purple">
                            {value.title}
                          </div>
                        ),
                    )}
                  </div>
                )}
                {openedTab.includes(`Tab_${val.id}`) && open
                  ? val.list?.map(
                      (e: any) =>
                        roles?.includes(e.role) && (
                          <div
                            key={e.id}
                            className={`${
                              activeTab === e.id ? 'bg-[#9B86BA]' : ''
                            } flex flex-row p-2 m-2 rounded-xl items-center justify-between hover:bg-[#9B86BA]`}
                            role="button"
                            onClick={() => {
                              setActiveTab(e.id);
                              if (e.path) navigate(e.path);
                            }}>
                            <p
                              className={`${
                                activeTab === e.id ? 'font-bold' : 'font-base'
                              } text-white text-sm ml-8`}>
                              {e.title}
                            </p>
                          </div>
                        ),
                    )
                  : null}
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div className={`flex flex-col items-center justify-center my-10 ${open ? 'w-[95%]' : ''}`}>
        {footerList.map(val => (
          <div
            key={val.id}
            role="button"
            onClick={() => {
              if (val.id === 99) {
                setOpenLogoutModal(true);
              } else if (val.id === 98) {
                setOpenEditProfileModal(true);
              }
            }}
            className={`
                ${activeTab === val.id ? 'bg-[#9B86BA] font-bold' : ''}
                ${val.bordered && open && ' border border-white'}
                ${open ? 'w-40' : 'p-2'}
                p-2 text-white rounded-2xl mb-2 text-center flex items-center justify-center
              `}>
            {val.icon && (
              <img src={val.icon} alt={`Menu_${val.id}`} className={`${open && 'mr-4'} w-4 h-4`} />
            )}
            {open && val.title}
          </div>
        ))}
      </div>
    );
  };

  return (
    <React.Fragment>
      <Modal open={openEditProfileModal} width={600} toggle={() => null}>
        <div className="flex justify-between">
          <p className="text-2xl font-bold">{t('user.edit-profile.title')}</p>
          <img
            src={CloseIcon}
            className="cursor-pointer w-[18px] h-[18px]"
            onClick={() => {
              setOpenEditProfileModal(false);
              reset();
              handlerCancel();
            }}
          />
        </div>
        <form
          className="w-full flex flex-col items-center gap-4"
          onSubmit={handleSubmit(submitEditProfile)}>
          <Controller
            name="avatar"
            control={control}
            render={() => (
              <FileUploaderAvatar
                image={getValues().avatar}
                imageChanged={(image: any) => {
                  setValue('avatar', image);
                }}
              />
            )}
          />

          <Controller
            name="fullName"
            control={control}
            defaultValue={getValues().fullName}
            rules={{ required: t('components.atoms.required') ?? '' }}
            render={({ field }) => (
              <div className="w-full">
                <InputText
                  labelTitle={t('user.edit-profile.fullname')}
                  labelStyle="font-bold"
                  labelWidth={125}
                  direction="row"
                  themeColor="lavender"
                  roundStyle="xl"
                  isError={!!errors?.fullName}
                  helperText={errors?.fullName?.message}
                  {...field}
                />
              </div>
            )}
          />

          <Controller
            name="email"
            control={control}
            defaultValue={getValues().email}
            render={({ field }) => (
              <div className="w-full">
                <InputText
                  labelTitle={t('user.edit-profile.email')}
                  labelStyle="font-bold"
                  labelWidth={125}
                  direction="row"
                  themeColor="lavender"
                  roundStyle="xl"
                  disabled
                  {...field}
                />
              </div>
            )}
          />
          <div className={`w-full flex gap-3 justify-between`}>
            <button
              className="btn btn-outline btn-primary"
              onClick={e => {
                handlerActionLink(e);
              }}>
              {t('user.edit-profile.change-password')}
            </button>
            <div className="flex flex-row gap-3">
              <button
                type="reset"
                className="btn btn-outline w-[105px]"
                onClick={() => {
                  setOpenEditProfileModal(false);
                  reset();
                  handlerCancel();
                }}>
                {t('user.edit-profile.cancel')}
              </button>
              <button className={`btn btn-success w-[105px]`} type="submit">
                {isLoadingEditProfileModal ? t('loading') + '...' : t('user.edit-profile.save')}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal open={openChangePasswordModal} width={600} height={'100%'} toggle={() => null}>
        <div className="flex justify-between">
          <p className="text-2xl font-bold">{t('user.change-password.title')}</p>
          <img
            src={CloseIcon}
            className="cursor-pointer w-[18px] h-[18px]"
            onClick={() => {
              setOpenChangePasswordModal(false);
              resetYup();
              handlerCancel();
            }}
          />
        </div>
        <form
          className="w-full flex flex-col items-center gap-4"
          onSubmit={handleSubmitYup(submitChangePassword)}>
          <Controller
            control={controlYup}
            name="currentPassword"
            defaultValue={getValuesYup().currentPassword}
            render={({ field }) => (
              <InputPassword
                labelTitle={t('user.change-password.recent-password')}
                labelStyle="font-bold"
                labelWidth={175}
                direction="row"
                themeColor="lavender"
                isError={!!errorsYup?.currentPassword}
                errorMessage={errorsYup?.currentPassword?.message}
                roundStyle="xl"
                {...field}
              />
            )}
          />
          <Controller
            control={controlYup}
            name="newPassword"
            defaultValue={getValuesYup().newPassword}
            render={({ field }) => (
              <InputPassword
                labelTitle={t('components.molecules.new-password')}
                labelStyle="font-bold"
                labelWidth={175}
                direction="row"
                themeColor="lavender"
                isError={!!errorsYup?.newPassword}
                errorMessage={errorsYup?.newPassword?.message}
                roundStyle="xl"
                {...field}
              />
            )}
          />
          <Controller
            control={controlYup}
            name="confirmNewPassword"
            defaultValue={getValuesYup().confirmNewPassword}
            render={({ field }) => (
              <InputPassword
                labelTitle={t('user.change-password.confirm-password')}
                labelStyle="font-bold"
                labelWidth={175}
                direction="row"
                themeColor="lavender"
                isError={!!errorsYup?.confirmNewPassword || confirmNewPasswordError}
                errorMessage={
                  confirmNewPasswordError
                    ? t('form.user.change-password.confirm-password-not-match') ?? ''
                    : errorsYup?.confirmNewPassword?.message
                }
                roundStyle="xl"
                {...field}
              />
            )}
          />
          <div className="w-full flex flex-row justify-end gap-3">
            <button
              type="reset"
              className="btn btn-outline w-[105px]"
              onClick={() => {
                setOpenChangePasswordModal(false);
                reset();
                handlerCancel();
              }}>
              {t('user.edit-profile.cancel')}
            </button>
            <button className={`btn w-[105px]`} type="submit">
              {isLoadingChangePasswordProfileModal
                ? t('loading') + '...'
                : t('user.edit-profile.save')}
            </button>
          </div>
        </form>
      </Modal>
      <ModalConfirm
        open={openLogoutModal}
        title={t('user.logout.title')}
        cancelTitle={t('user.logout.no')}
        cancelAction={() => {
          setOpenLogoutModal(false);
        }}
        submitTitle={t('user.logout.yes')}
        submitAction={() => {
          handeLogout();
        }}
        icon={WarningOrange}
        message={t('user.logout.message', { name: getValues().fullName }) ?? ''}
        btnSubmitStyle={'bg-secondary-warning border border-tertiary-warning'}
      />
      <div
        className={`${
          open
            ? 'px-2 pt-3 pb-24 overflow-scroll scrollbar scrollbar-w-3 scrollbar-track-rounded-xl scrollbar-thumb-rounded-xl scrollbar-thumb-light-purple'
            : ''
        } w-full h-full flex flex-col items-center border bg-[#5E217C]`}>
        {renderHeader()}
        {renderListMenu()}
        {renderFooter()}
      </div>
    </React.Fragment>
  );
};
