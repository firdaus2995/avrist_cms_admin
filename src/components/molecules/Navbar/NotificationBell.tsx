import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import Bell from '../../../assets/bell.svg';
import NotifCheck from '../../../assets/notif-check.svg';
import { store, useAppDispatch } from '@/store';
import { Menu, Transition } from '@headlessui/react';
import { setActivatedNotificationPage } from '@/services/Notification/notificationSlice';
import { getCredential } from '@/utils/Credential';
import {
  useGetNotificationQuery,
  useReadNotificationMutation,
  useSeeNotificationMutation,
} from '@/services/Notification/notificationApi';
import { t } from 'i18next';
import { Link } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_URL;
const intervalTime = import.meta.env.VITE_NOTIFICATION_INTERVAL;

const NotificationBell = (props: { notificationCount: any; }): JSX.Element => {
  const token = getCredential().accessToken;
  const ref = useRef(null);
  const dispatch = useAppDispatch();
  const {notificationCount} = props;

  // RTK READ NOTIFICATION
  const [ readNotification ] = useReadNotificationMutation();

  const [notifications, setNotifications] = useState<any>([]);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState<number>(5);
  const [total, setTotal] = useState<any>(0);
  const [isShow, setIsShow] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  const getCount = async () => {
    setIsFetching(true);
    await fetch(`${baseUrl}/notifications/count`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getCredential().accessToken}`,
      },
    })
      .then(async response => await response.json())
      .then(data => {
        setCount(data?.data?.result);
        setIsFetching(false);
      })
      .catch(err => {
        setIsFetching(false);
        console.log(err);
      });
  };

  useClickAway(ref, () => {
    setTotal(0);
    setLimit(5);
  });

  // RTK SEE NOTIFICATION
  const [seeNotification] = useSeeNotificationMutation();

  // RTK GET NOTIFICATION
  const fetchQuery = useGetNotificationQuery(
    {
      limit,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (!isShow) {
      const interval = setInterval(() => {
        if (
          document.visibilityState === 'visible' &&
          !store.getState().notificationSlice.activatedNotificationPage
        ) {
          if (token) {
            if (!isFetching) {
              void getCount();
            }
          }
        }
      }, intervalTime);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isShow]);

  useEffect(() => {
    if (notificationCount > 0) {
      setCount(notificationCount);
    }
  },[notificationCount])

  useEffect(() => {
    const loadMore = async () => {
      try {
        const backendData: any = await fetchQuery.refetch();
        if (backendData) {
          setTotal(backendData?.data?.notificationList.total);
          setNotifications(backendData?.data?.notificationList?.notifications);
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
    };

    if (limit > 5) {
      void loadMore();
    }
  }, [limit]);

  const handlerOpenNotification = async (open: boolean) => {
    if (!open) {
      try {
        await seeNotification();
        const backendData: any = await fetchQuery.refetch();
        if (backendData) {
          setTotal(backendData?.data?.notificationList.total);
          setNotifications(backendData?.data?.notificationList?.notifications);
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
    } else {
      setTotal(0);
      setLimit(5);
    }
  };

  const handlerFetchMore = () => {
    setLimit(limit + 5);
  };

  const handlerReadAll = async () => {
    const payload = {
      notificationId: "all",
    };
    try {
      void await readNotification(payload);
      const backendData: any = await fetchQuery.refetch();
      if (backendData) {
        setTotal(backendData?.data?.notificationList.total);
        setNotifications(backendData?.data?.notificationList?.notifications);
      };
    } catch (error) {
      console.log(error);
    };
  };

  const handlerReadNotificationSingle = async (id: any) => {
    const payload = {
      notificationId: id.toString(),
    };
    try {
      void await readNotification(payload);
      const backendData: any = await fetchQuery.refetch();
      if (backendData) {
        setTotal(backendData?.data?.notificationList.total);
        setNotifications(backendData?.data?.notificationList?.notifications);
      };
    } catch (error) {
      console.log(error);
    };
  };

  return (
    <Menu ref={ref} as="div" className="relative inline-block text-left z-[999]">
      {({ open, close }) => (
        <React.Fragment>
          <Menu.Button
            className={'h-[56px]'}
            onClick={() => {
              setCount(0);
              void handlerOpenNotification(open);
            }}>
            <div className="relative cursor-pointer">
              <img src={Bell} alt="Notif" className="w-[48px]" />
              {count > 0 && (
                <div className="absolute right-0 top-0 w-[24px] text-reddist font-bold border-2 border-light-purple rounded-full bg-light-purple-2">
                  {count}
                </div>
              )}
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
            beforeEnter={() => {
              setIsShow(true);
            }}
            beforeLeave={() => {
              setIsShow(false);
            }}>
            <Menu.Items className="fixed right-1 mt-3 w-96 translate-x-0 shadow-lg bg-white">
              <div className="p-[14px] border-b-[1px] border-[#D6D6D6] flex justify-between">
                <h1 className="text-[14px] font-bold"> {t('user.notification.title')}</h1>
                <div
                  className="flex justify-between gap-[12px] cursor-pointer"
                  onClick={handlerReadAll}>
                  <img src={NotifCheck} />
                  <span className="text-[14px] font-bold text-purple">
                    {t('user.notification.mark-all-as-read')}
                  </span>
                </div>
              </div>
              <InfiniteScroll
                className="px-[16px] border-[#D6D6D6]"
                dataLength={notifications.length}
                next={handlerFetchMore}
                loader={''}
                hasMore={limit < total}
                height={500}>
                {notifications.length > 0 &&
                  notifications.map((element: any, index: number) => (
                    <Link
                      to={element.link}
                      key={index}
                      onClick={() => {
                        void handlerReadNotificationSingle(element.id)
                      }}
                      className="flex flex-row flex-start gap-[8px] py-[8px] border-b-[1px] border-[#D6D6D6]">
                      <div
                        className={`mt-[6px] w-[6px] h-[6px] min-w-[6px] rounded-full ${
                          element.isRead ? 'bg-white' : 'bg-purple'
                        }`}
                      />
                      <div className="flex flex-col flex-1 gap-[6px]">
                        <h2
                          className={`text-[12px] font-bold ${
                            element.isRead ? 'text-body-text-4' : 'text-purple'
                          }`}>
                          {element.title}
                        </h2>
                        <h4 className="text-[14px] text-body-text-2 cursor-pointer">
                          {element.content}
                        </h4>
                        <h6 className="text-[12px] text-body-text-1">{`${dayjs(
                          element.createdAt,
                        ).format('MMM DD, YYYY')} at ${dayjs(element.createdAt).format(
                          'HH:mm',
                        )}`}</h6>
                      </div>
                    </Link>
                  ))}
              </InfiniteScroll>
              <div className="flex flex-row justify-end p-[16px]">
                <h2
                  className="text-[12px] font-bold text-purple cursor-pointer"
                  onClick={() => {
                    dispatch(setActivatedNotificationPage(true));
                    close();
                  }}>
                  {t('user.notification.view-all-notification')}
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
