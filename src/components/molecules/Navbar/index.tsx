import React, { useEffect, useState } from 'react';

import NotificationBell from './NotificationBell';
import { useAppSelector } from '../../../store';
import { useGetUserProfileQuery } from '../../../services/User/userApi';
import { useGetCmsEntityLogoQuery } from '@/services/Config/configApi';
import restApiRequest from '@/utils/restApiRequest';
interface INavbar {
  open: boolean;
  setOpen: (t: boolean) => void;
};

export const Navbar: React.FC<INavbar> = ({
  open,
  setOpen,
}) => {
  const { title } = useAppSelector(s => s.navbarSlice);
  const [logo, setLogo] = useState("");
  const [count, setCount] = useState(0);
 
  // RTK USER PROFILE
  const fetchUserDetailQuery = useGetUserProfileQuery({});
  const { data } = fetchUserDetailQuery;

  // RTK GETCONFIG LOGO
  const fetchLogoQuery = useGetCmsEntityLogoQuery({});
  const { data: dataLogo } = fetchLogoQuery;

  // GET COUNT NOTIFICATION
  const getCount = async () => {
    try {
      const imageUrl = `/notifications/count`;
      const response = await restApiRequest('GET', imageUrl, null, 'json' );
  
      if (response) {
        setCount(response?.data?.data?.result);
      }
    } catch (err) {
      console.error(err);
    }
  
    return '';
  };

  useEffect(() => {
    if (dataLogo?.getConfig) {
      setLogo(dataLogo?.getConfig?.value);
    };
  }, [dataLogo])

  useEffect(() => {
    void getCount();
  }, [])

  return (
    <div
      className={`${
        open ? 'lg:pl-[300px]' : 'lg:pl-[100px]'
      } pl-[32px] w-full  h-[72px] border  pr-[32px] flex items-center justify-between fixed bg-white z-20`}>
      <svg
        onClick={() => {
          setOpen(!open);
        }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 cursor-pointer lg:hidden visible">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
      <h1 className="text-xl font-semibold">{title}</h1>
      <img 
        src={data?.userProfile?.company === 'AGI' ? logo : data?.userProfile?.company === 'Avram' ? logo : logo}
        className="w-24 absolute right-0 left-0 mx-auto" 
      />
      <div className="flex gap-[22px] items-center">
        <NotificationBell notificationCount={count > 0 ? count : ''} />
      </div>
    </div>
  );
};

