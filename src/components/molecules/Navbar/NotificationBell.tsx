import React, { useEffect, useRef, useState } from 'react';
import {useClickAway} from 'react-use';

import Bell from '../../../assets/bell.svg';
import NotifCheck from '../../../assets/notif-check.svg';
import { useAppDispatch } from '@/store';
import { Menu, Transition } from '@headlessui/react';
import { setActivatedNotificationPage } from '@/services/Notification/notificationSlice';
import { useGetNotificationQuery, useSeeNotificationMutation } from '@/services/Notification/notificationApi';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';

const NotificationBell: React.FC = () => {
  const ref = useRef(null);
  const dispatch = useAppDispatch();

  const [notifications, setNotifications] = useState<any>([]);
  const [limit, setLimit] = useState<number>(5);
  const [total, setTotal] = useState<any>(0);

  useClickAway(ref, () => {
    setTotal(0);
    setLimit(5);
  });

  // RTK SEE NOTIFICATION
  const [ seeNotification ] = useSeeNotificationMutation();

  // RTK GET NOTIFICATION
  const fetchQuery = useGetNotificationQuery({
    limit,
  }, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const loadMore = async () => {
      try {
        const backendData: any = await fetchQuery.refetch();
        if (backendData) {
          setTotal(backendData?.data?.notificationList.total);
          setNotifications(backendData?.data?.notificationList?.notifications);
        };    
      } catch (error) {
        console.error("Error while fetching data:", error);
      };
    };

    if (limit > 5) {
      void loadMore();
    };
  }, [limit])

  // IMPLEMENT IT LATER
  // const countUnreadedNotification = () => {
  //   let count = 0;
  //   for (const iterator of notifications) {
  //     if (iterator.isRead === false) {
  //       count++;
  //     };
  //   };
  //   return count;
  // };

  const handlerOpenNotification = async (open: boolean) => {
    if (!open) {
      try {
        await seeNotification();
        const backendData: any = await fetchQuery.refetch();
        if (backendData) {
          setTotal(backendData?.data?.notificationList.total);
          setNotifications(backendData?.data?.notificationList?.notifications);
        };  
      } catch (error) {
        console.error("Error while fetching data:", error);
      };
    } else {
      setTotal(0);
      setLimit(5);
    };
  };

  const handlerFetchMore = async () => {
    setLimit(limit + 5);
  };

  const handlerReadAll = (event: any) => {
    console.log(event);
  };

  return (
    <Menu 
      ref={ref}
      as="div" 
      className="relative inline-block text-left z-[999]"
    >
      {({ open, close }) => (
        <React.Fragment>
          <Menu.Button 
            className={'h-[56px]'}
            onClick={() => {
              void handlerOpenNotification(open);
            }}
          >
            <div className="relative cursor-pointer">
              <img src={Bell} alt="Notif" className="w-[48px]" />
              {/* IMPLEMENT IT LATER */}
              {/* {
                notifications.length > 0 && (
                  <div className='absolute right-0 top-0 w-[24px] text-reddist font-bold border-2 border-light-purple rounded-full bg-light-purple-2'>
                    {countUnreadedNotification()}
                  </div>
                )
              } */}
            </div>
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className='fixed right-1 mt-3 w-96 translate-x-0 shadow-lg bg-white'>
              <div className="p-[14px] border-b-[1px] border-[#D6D6D6] flex justify-between">
                <h1 className="text-[14px] font-bold">Notifications</h1>
                <div className='flex justify-between gap-[12px] cursor-pointer' onClick={handlerReadAll}>
                  <img src={NotifCheck} />
                  <span className='text-[14px] font-bold text-purple'>Mark All as Read</span>
                </div>
              </div>
              <InfiniteScroll
                className='px-[16px] border-[#D6D6D6]'
                dataLength={total}
                next={handlerFetchMore}
                loader={''}
                hasMore={notifications.length < total}
                height={530}
              >
                {
                  notifications.length > 0 && (
                    notifications.map((element: any, index: number) => (
                      <div key={index} className='flex flex-row flex-start gap-[8px] py-[8px] border-b-[1px] border-[#D6D6D6]'>
                        <div className={`mt-[6px] w-[6px] h-[6px] min-w-[6px] rounded-full ${element.isRead ? 'bg-white' : 'bg-purple'}`} />
                        <div className='flex flex-col flex-1 gap-[6px]'>
                          <h2 className={`text-[12px] font-bold ${element.isRead ? 'text-body-text-4' : 'text-purple'}`}>{element.title}</h2>
                          <h4 className='text-[14px] text-body-text-2'>{element.content}</h4>
                          <h6 className='text-[12px] text-body-text-1'>{`${dayjs(element.createdAt).format('MMM DD, YYYY')} at ${dayjs(element.createdAt).format('HH:mm')}`}</h6>
                        </div>
                      </div>
                    ))
                  )
                }
              </InfiniteScroll>
              <div className='flex flex-row justify-end p-[16px]'>
                <h2
                  className='text-[12px] font-bold text-purple cursor-pointer'
                  onClick={() => {
                    dispatch(setActivatedNotificationPage(true));
                    close();
                  }}
                >
                  View All Notification
                </h2>
              </div>
            </Menu.Items>
          </Transition>
        </React.Fragment>
      )}
    </Menu>
  );
};

export default NotificationBell;
