import React, { useEffect, useState } from 'react';
import { isDesktop, isTablet, isMobile } from 'react-device-detect';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router';

import Notification from '../Notification';
import { setOpen } from './slice';
import { Navbar } from '../../molecules/Navbar';
import { Sidebar } from '../../molecules/Sidebar';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setActivatedNotificationPage } from '@/services/Notification/notificationSlice';
import { useGetNotificationQuery, useSeeNotificationMutation } from '@/services/Notification/notificationApi';

const Layout: React.FC<any> = props => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { open } = useAppSelector(s => s.layoutSlice);
  const { activatedNotificationPage } = useAppSelector(s => s.notificationSlice)

  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<any>(0);

  // RTK SEE NOTIFICATION
  const [ seeNotification ] = useSeeNotificationMutation();

  // RTK GET NOTIFICATION
  const fetchNotification = useGetNotificationQuery({
    limit,
  }, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    dispatch(setActivatedNotificationPage(false));
  }, [location.pathname]);

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
        className={`${open ? 'lg:pl-[300px] md:pl-[300px]' : 'lg:pl-[100px]'} pr-[32px] md:pl-[100px] pl-[32px] pt-[100px] h-full ease-in-out duration-300`}
      >
        {
          activatedNotificationPage ? (
            <Notification 
              limit={limit}
              setLimit={setLimit}
              total={total}
              setTotal={setTotal}
              seeNotification={seeNotification}
              fetchNotification={fetchNotification}
            />
          ) : (
            <React.Fragment>
              <Outlet />
              {props.children}
            </React.Fragment>
          )
        }
      </div>
    </div>
  );
};
export default Layout;
