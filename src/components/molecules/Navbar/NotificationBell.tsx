import React, { useEffect, useState } from 'react';

import Bell from '../../../assets/bell.svg';
import NotifCheck from '../../../assets/notif-check.svg';
import { useAppDispatch } from '@/store';
import { Menu, Transition } from '@headlessui/react';
import { setActivatedNotificationPage } from '@/services/Notification/notificationSlice';
import { getCredential } from '@/utils/Credential';

const baseUrl = import.meta.env.VITE_API_URL;
const intervalTime = import.meta.env.VITE_NOTIFICATION_INTERVAL;
const NotificationBell: React.FC = () => {
  const token = getCredential().accessToken;
  const dispatch = useAppDispatch();
  const [notifications, setNotifications] = useState<any>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setNotifications([
      {
        title: 'New Update!',
        body: 'Hey Rifky, your password has been updated!',
        date: 'Jun 30, 2023 at 19:25',
        isRead: false,
      },
      {
        title: 'New Update!',
        body: 'Hey Rifky your Email Form Builder has been Reviewed',
        date: 'Jun 30, 2023 at 19:35',
        isRead: true,
      },
      {
        title: 'New Update!',
        body: 'Hey Rifky you got new approval task for Email Form Builder waiting for you, please do this task immediately',
        date: 'Jun 30, 2023 at 19:45',
        isRead: false,
      },
    ])
  }, []);

  const getCount = async () => {
    await fetch(`${baseUrl}/notifications/count`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async (response) => await response.json())
    .then((data) => {
      setCount(data?.data?.result)
    })
    .catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
  
    const interval = setInterval(() => {
      if(token){
        void getCount()
      }
    }, intervalTime);

    return () => { clearInterval(interval); };
  }, []);

  const handlerReadAll = (event: any) => {
    console.log(event);
  };

  return (
    <Menu as="div" className="relative inline-block text-left z-[999]">
      {({ close }) => (
        <React.Fragment>
          <Menu.Button className={'h-[56px]'}>
            <div className="relative cursor-pointer">
              <img src={Bell} alt="Notif" className="w-[48px]" />
              {
                count > 0 && (
                  <div className='absolute right-0 top-0 w-[24px] text-reddist font-bold border-2 border-light-purple rounded-full bg-light-purple-2'>
                    {count}
                  </div>
                )
              }
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
              <div className='px-[16px] border-[#D6D6D6]'>
                {
                  notifications.length > 0 && (
                    notifications.map((element: any, index: number) => (
                      <div key={index} className='flex flex-row flex-start gap-[8px] py-[8px] border-b-[1px] border-[#D6D6D6]'>
                        <div className={`mt-[6px] w-[6px] h-[6px] min-w-[6px] rounded-full ${element.isRead ? 'bg-white' : 'bg-purple'}`} />
                        <div className='flex flex-col flex-1 gap-[6px]'>
                          <h2 className={`text-[12px] font-bold ${element.isRead ? 'text-body-text-4' : 'text-purple'}`}>{element.title}</h2>
                          <h4 className='text-[14px] text-body-text-2'>{element.body}</h4>
                          <h6 className='text-[12px] text-body-text-1'>{element.date}</h6>
                        </div>
                      </div>
                    ))
                  )
                }
              </div>
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
