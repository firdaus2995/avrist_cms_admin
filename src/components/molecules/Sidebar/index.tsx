import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearAuth } from '@/services/Login/slice';

import { sidebarList } from './list';
import Menu from '@/assets/menu.png';
import LogoutIcon from '@/assets/sidebar/Logout-icon.png';
import ProfilePhoto from '@/assets/Profile-photo.png';
import ModalForm from '../ModalForm';
import { InputText } from '@/components/atoms/Input/InputText';
import { InputPassword } from '@/components/atoms/Input/InputPassword';
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
const MenuSidebar: React.FC<IMenuSidebar> = ({
  open,
}) => {
  const footerList = [
    {
      id: 98,
      title: 'Edit Profile',
      bordered: true,
    },
    {
      id: 99,
      title: 'Logout',
      icon: LogoutIcon,
    },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  
  const [openedTab, setOpenedTab] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(1);
  // EDIT PROFILE
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [fullname, setFullname] = useState("Haykal Shafiq");
  const [email, setEmail] = useState("haykal@gmail.com");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  // CHANGE PASSWORD
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [recentPassword, setRecentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(false);

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

  const listTabHandler = (e: string) => {
    if (openedTab.includes(e)) {
      const filtered = openedTab.filter(val => val !== e);
      setOpenedTab(filtered);
    } else {
      setOpenedTab(val => [...val, e]);
    }
  };

  const handlerActionLink = () => {
    setOpenEditProfileModal(false);
    setTimeout(() => {
      setOpenChangePasswordModal(true);
    }, 50);
  };

  const submitEditProfile = () => {
    if (!password) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    };
  };

  const submitChangePassword = () => {
    if (confirmNewPassword !== newPassword) {
      setConfirmNewPasswordError(true);
    } else {
      setConfirmNewPasswordError(false);
    };
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-col items-center justify-center my-5">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          <div
            className="w-11 h-11 rounded-full bg-black bg-cover"
            style={{ backgroundImage: `url(${ProfilePhoto})` }}></div>
        </div>
        {open && (
          <div className="text-white flex flex-col mt-2 items-center justify-center">
            <p className="font-bold">Haykal</p>
            <p>600234563</p>
            <p>Employee - Submitter</p>
          </div>
        )}
      </div>
    );
  };

  const renderListMenu = () => {
    return (
      <div className="border-b pb-5">
        {sidebarList.map((val: any) => (
          <div key={val.id}>
            <div
              role="button"
              onClick={() => {
                val.list ? listTabHandler(`Tab_${val.id}`) : setActiveTab(val.id);
                if (val.path) navigate(val.path);
              }}
              className={`${activeTab === val.id ? 'bg-[#9B86BA]' : ''} ${
                open ? 'justify-between m-2' : 'justify-center m-3'
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
            {openedTab.includes(`Tab_${val.id}`) && open
              ? val.list?.map((e: any) => (
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
                ))
              : null}
          </div>
        ))}
      </div>
    );
  };

  const renderFooter = () => {
    // LOGOUT
    const dispatch = useDispatch();

    const handleLogout = () => {
      dispatch(clearAuth());
    };

    return (
      <div className="flex flex-col items-center justify-center my-10">
        {
          footerList.map(val => (
            <div
              key={val.id}
              role="button"
              onClick={() => {
                if (val.id === 99) {
                  setActiveTab(val.id);
                  handleLogout();
                } else if (val.id === 98) {
                  setOpenEditProfileModal(true);
                };
              }}
              className={`
                ${activeTab === val.id ? 'bg-[#9B86BA] font-bold' : ''} 
                ${val.bordered && open && ' border border-white'}
                ${open ? 'w-40' : 'p-2'} 
                p-2 text-white rounded-2xl mb-2 text-center flex items-center justify-center
              `}
            >
              {
                val.icon && (
                  <img src={val.icon} alt={`Menu_${val.id}`} className={`${open && 'mr-4'} w-4 h-4`} />
                )
              }
              {open && val.title}
            </div>
          ))
        }
      </div>
    );
  };

  return (
    <React.Fragment>
      <ModalForm
        height={700}
        width={600}
        open={openEditProfileModal}
        // loading={isLoadingEditProfileModal}
        formTitle="Edit Profile"
        submitTitle="Save"
        cancelTitle="Cancel"
        cancelAction={() => {
          setOpenEditProfileModal(false);
          setPasswordError(false);
          setConfirmNewPasswordError(false);
        }}
        submitAction={submitEditProfile}
      >
        <img 
          style={{
            width: 120,
            justifySelf: 'center',
            marginBottom: 20,
          }}
          src='https://i.ibb.co/sC3PRC1/Group-26683.jpg'
        />
        <InputText
          labelTitle="Fullname"
          labelStyle="font-bold	"
          labelWidth={125}
          value={fullname}
          direction="row"
          themeColor="lavender"
          roundStyle="xl"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFullname(event.target.value);
          }}
        />
        <InputText
          labelTitle="Email"
          labelStyle="font-bold	"
          labelWidth={125}
          value={email}
          direction="row"
          themeColor="lavender"
          roundStyle="xl"
          disabled
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value);
          }}
        />
        <InputPassword
          labelTitle="Password"
          labelStyle="font-bold	"
          labelWidth={125}
          value={password}
          direction="row"
          themeColor="lavender"
          roundStyle="xl"
          isError={passwordError}
          actionLink='Change Password'
          actionLinkClicked={handlerActionLink}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
          }}
        />
      </ModalForm>
      <ModalForm
        width={600}
        open={openChangePasswordModal}
        // loading={isLoadingEditProfileModal}
        formTitle="Change Password"
        submitTitle="Save"
        cancelTitle="Cancel"
        cancelAction={() => {
          setOpenChangePasswordModal(false);
          setPasswordError(false);
          setConfirmNewPasswordError(false);
          setRecentPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        }}
        submitAction={submitChangePassword}      
      >
        <InputPassword
          labelTitle="Recent Password"
          labelStyle="font-bold	"
          labelWidth={175}
          value={recentPassword}
          direction="row"
          themeColor="lavender"
          roundStyle="xl"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setRecentPassword(event.target.value);
          }}
        />
        <InputPassword
          labelTitle="New Password"
          labelStyle="font-bold	"
          labelWidth={175}
          value={newPassword}
          direction="row"
          themeColor="lavender"
          roundStyle="xl"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewPassword(event.target.value);
          }}
        />
        <InputPassword
          labelTitle="Confirm New Password"
          labelStyle="font-bold	"
          labelWidth={175}
          value={confirmNewPassword}
          direction="row"
          themeColor="lavender"
          roundStyle="xl"
          isError={confirmNewPasswordError}
          errorMessage="Confirm password doesn’t match. Please try again!"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setConfirmNewPassword(event.target.value);
          }}
        />
      </ModalForm>
      <div
        className={`${
          open ? 'px-2 pt-3 pb-24' : ''
        } w-full h-full flex flex-col border bg-[#5E217C] overflow-auto`}>
        {renderHeader()}
        {renderListMenu()}
        {renderFooter()}
      </div>
    </React.Fragment>
  );
};
