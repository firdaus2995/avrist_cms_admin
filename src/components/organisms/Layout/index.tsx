import React from 'react';
import { Navbar } from '../../molecules/Navbar';
import { Sidebar } from '../../molecules/Sidebar';
import { isDesktop, isTablet, isMobile } from 'react-device-detect';
import { Outlet } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setOpen } from './slice';

const Layout: React.FC<any> = props => {
  const dispatch = useAppDispatch();
  const { open } = useAppSelector(s => s.layoutSlice);
  return (
    <div>
      {(isMobile || isTablet || isDesktop) && (
        <Sidebar
          open={open}
          setOpen={() => {
            dispatch(setOpen(!open));
          }}
        />
      )}

      <Navbar
        open={open}
        setOpen={() => {
          dispatch(setOpen(!open));
        }}
      />
      <div
        className={`${
          open ? 'lg:pl-[300px] md:pl-[300px]' : 'lg:pl-[100px]'
        } pr-[32px] md:pl-[100px] pl-[32px] pt-[100px] h-full bg-[#F9F5FD] ease-in-out duration-300`}>
        <Outlet />
        {props.children}
      </div>
    </div>
  );
};
export default Layout;
