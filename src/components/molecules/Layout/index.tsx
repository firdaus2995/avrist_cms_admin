import React from 'react';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';
import { isDesktop } from 'react-device-detect';
import { Outlet } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setOpen } from './slice';

const Layout: React.FC<any> = props => {
  const dispatch = useAppDispatch();
  const { open } = useAppSelector(s => s.layoutSlice);
  return (
    <div>
      {isDesktop && (
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
          open ? 'lg:pl-[300px]' : 'lg:pl-[100px]'
        } pr-[32px] pl-[32px]   pt-[100px] h-screen`}>
        <Outlet />
        {props.children}
      </div>
    </div>
  );
};
export default Layout;
