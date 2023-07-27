import React, { useEffect, useState } from 'react';
import Bell from '../../../assets/bell.png';
import Profile from '../../../assets/profile.png';
import { Menu, Transition } from '@headlessui/react';
import { useAppSelector } from '../../../store';
import { useGetUserProfileQuery } from '../../../services/User/userApi';
import { useGetCmsEntityLogoQuery } from '@/services/Config/configApi';
interface INavbar {
  open: boolean;
  setOpen: (t: boolean) => void;
}
export const Navbar: React.FC<INavbar> = props => {
  const { open, setOpen } = props;
  const { title } = useAppSelector(s => s.navbarSlice);
 
  const fetchUserDetailQuery = useGetUserProfileQuery({});
  const { data } = fetchUserDetailQuery;

  const [logo, setLogo] = useState("");
  const fetchLogoQuery = useGetCmsEntityLogoQuery({});
  const { data: dataLogo } = fetchLogoQuery;

  useEffect(() => {
    if (dataLogo?.getConfig) {
      setLogo(dataLogo?.getConfig?.value);
    };
  }, [dataLogo])

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
        className="w-6 h-6 cursor-pointer  lg:hidden visible">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
      <h1 className="text-xl font-semibold">{title}</h1>
      <img 
        src={
          data?.userProfile?.company === 'AGI' ? logo 
          : data?.userProfile?.company === 'Avram' ? logo 
          : logo
        }
        className="w-24 absolute right-0 left-0 mx-auto" />
      <div className="flex gap-[22px] items-center">
        <BellNotif />
        {/* <ProfilePicture /> */}
      </div>
    </div>
  );
};
// const ProfilePicture: React.FC = () => {
//   return (
//     <Menu as="div" className="relative inline-block text-left z-[999]">
//       <Menu.Button className={'h-[56px]'}>
//         <div className="w-[42px] h-[42px] rounded-full bg-[#FFECF0] flex justify-center items-center cursor-pointer">
//           <img src={Profile} alt="Profile" className="w-6" />
//         </div>
//       </Menu.Button>
//       <Transition
//         as={React.Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95">
//         <Menu.Items
//           className={
//             'fixed md:absolute lg:-right-6 -right-0 mt-3 lg:-translate-x-0 w-80 h-80 md:h-[427px] -translate-x-0  lg:w-[392px]  divide-y  rounded-md  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
//           }>
//           <div>
//             <h1 className="text-[16px] font-semi-bold">Profile Here</h1>
//           </div>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   );
// };
const BellNotif: React.FC = () => {
  return (
    <Menu as="div" className="relative inline-block text-left z-[999]">
      <Menu.Button className={'h-[56px]'}>
        <div className="relative cursor-pointer">
          <img src={Bell} alt="Notif" className="w-6 " />
          <div className="absolute -top-2 left-2 w-[24px] h-[19px] rounded-[12px] border-[1px] border-white bg-[#FF234B] flex justify-center items-center text-white text-[12px] font-semibold">
            2
          </div>
        </div>
      </Menu.Button>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items
          className={
            'fixed md:absolute lg:-right-6 -right-0 mt-3 lg:-translate-x-0 w-80 h-80 md:h-[427px] -translate-x-0  lg:w-[392px]  divide-y  rounded-md  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
          }>
          <div className="p-[16px]">
            <h1 className="text-[16px] font-semibold">Notifikasi</h1>
          </div>
          <div className="bg-[#FFECF0] p-[16px] flex gap-[12px] items-start  cursor-pointer">
            <div
              style={{ backgroundColor: 'rgba(255, 35, 75, 0.12)' }}
              className="w-[42px] h-[42px] rounded-xl  flex justify-center items-center cursor-pointer">
              <img src={Profile} alt="Profile" className="w-6" />
            </div>
            <div>
              <div className="flex items-center gap-[8px] mb-1">
                <p className="text-xs font-semibold text-[#2E8CE2]">Menunggu Approval </p>
                <div className="w-1 h-1 bg-[#798F9F] rounded-full"></div>
                <p className="text-xs font-semibold text-[#68788D]">Hari Ini </p>
              </div>
              <p className="text-sm font-normal max-w-[280px]">
                Mohon konfirmasi anggota baru dengan Nomor Anggota{' '}
                <span className="font-semibold text-[#28bcdc]">LM0019012</span>
              </p>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
