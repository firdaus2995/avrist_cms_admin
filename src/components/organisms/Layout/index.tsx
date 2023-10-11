import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useEffect, useState } from 'react';
import { isDesktop, isTablet, isMobile } from 'react-device-detect';
import { useLocation } from 'react-router-dom';
import { Outlet, useNavigate } from 'react-router';
import { ErrorBoundary } from "react-error-boundary";

import NotifCheck from '../../../assets/notif-check.svg';
import NoNotifications from '../../../assets/no-notifications.svg';
import DeleteSmall from '../../../assets/delete-small.svg';
import InternalServerError from '@/pages/Error/InternalServerError';
import { setOpen } from './slice';
import { Navbar } from '../../molecules/Navbar';
import { Sidebar } from '../../molecules/Sidebar';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import { copyArray } from '@/utils/logicHelper';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setActivatedNotificationPage } from '@/services/Notification/notificationSlice';
import { useDeleteNotificationMutation, useGetNotificationQuery, useReadNotificationMutation, useSeeNotificationMutation } from '@/services/Notification/notificationApi';
import { t } from 'i18next';
import { setEventTriggered } from '@/services/Event/eventErrorSlice';

const Layout: React.FC<any> = props => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { open } = useAppSelector(s => s.layoutSlice);
  const { activatedNotificationPage } = useAppSelector(s => s.notificationSlice)
  const { eventTriggered } = useAppSelector(s => s.eventErrorSlice)

  const [notifications, setNotifications] = useState<any>([]);
  const [isSelectedAll, setIsSelectedAll] = useState<any>(false);
  const [selected, setSelected] = useState<any>(0);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<any>(0);

  // RTK SEE NOTIFICATION
  const [ seeNotification ] = useSeeNotificationMutation();

  // RTK GET NOTIFICATION
  const fetchNotification = useGetNotificationQuery({
    limit,
  });

  // RTK READ NOTIFICATION
  const [ readNotification ] = useReadNotificationMutation();

  // RTK DELETE NOTIFICATION
  const [ deleteNotification ] = useDeleteNotificationMutation();

  useEffect(() => {
    if (eventTriggered === 'INTERNAL_ERROR') {
      navigate('internal-server-error');
    };
    dispatch(setEventTriggered(false));
  }, [eventTriggered])

  useEffect(() => {
    dispatch(setActivatedNotificationPage(false));
  }, [location.pathname]);

  useEffect(() => {
    const loadFirst = async () => {
      try {
        await seeNotification();
        const backendData: any = await fetchNotification.refetch();
        if (backendData) {
          setTotal(backendData?.data?.notificationList.total);
          setNotifications(backendData?.data?.notificationList?.notifications);
        };    
      } catch (error) {
        console.error("Error while fetching data:", error);
      };
    };

    if (activatedNotificationPage) {
      void loadFirst();
    };
  }, [activatedNotificationPage]);

  useEffect(() => {
    const loadMore = async () => {
      try {
        const backendData: any = await fetchNotification.refetch();
        if (backendData) {
          setTotal(backendData?.data?.notificationList.total);
          setNotifications(backendData?.data?.notificationList?.notifications);
        };    
      } catch (error) {
        console.error("Error while fetching data:", error);
      };
    };

    if (limit > 10) {
      void loadMore();
    };
  }, [limit]);

  useEffect(() => {
    const selected = notifications.filter((element: any) => {
      if (element.isSelected === true) {
        return element;
      } else {
        return false;
      };
    });

    setSelected(selected);
    if (selected.length === notifications.length) {
      setIsSelectedAll(true);
    } else {
      setIsSelectedAll(false)
    };
  }, [JSON.stringify(notifications)]);

  const goBack = () => {
    navigate(-1);
  };

  const handlerReadNotificationAll = async () => {
    const payload = {
      notificationId: "all",
    };
    try {
      void await readNotification(payload);
      const backendData: any = await fetchNotification.refetch();
      if (backendData) {
        setTotal(backendData?.data?.notificationList.total);
        setNotifications(backendData?.data?.notificationList?.notifications);
      };
    } catch (error) {
      console.log(error);
    };
  };

  const handlerDeleteNotificationSelected = async () => {
    const payload = selected.map((element: any) => {
      return element.id;
    }).join('|');
    try {
      void await deleteNotification({notificationId: payload});
      const backendData: any = await fetchNotification.refetch();
      if (backendData) {
        setTotal(backendData?.data?.notificationList.total);
        setNotifications(backendData?.data?.notificationList?.notifications);
      };
    } catch (error) {
      console.log(error);
    };    
  };

  const handlerSelectAll = (value: any, ) => {
    const newNotifications = copyArray(notifications);
    newNotifications.forEach((element: any) => {
      element.isSelected = value;
    });
    setIsSelectedAll(value);
    setNotifications(newNotifications);
  };

  const handlerSelectOne = (value: any, index: number) => {
    const newNotifications = copyArray(notifications);
    newNotifications[index].isSelected = value;
    setNotifications(newNotifications);
  };

  const handlerReadNotificationSingle = async (id: any) => {
    const payload = {
      notificationId: id.toString(),
    };
    try {
      void await readNotification(payload);
      const backendData: any = await fetchNotification.refetch();
      if (backendData) {
        setTotal(backendData?.data?.notificationList.total);
        setNotifications(backendData?.data?.notificationList?.notifications);
      };
    } catch (error) {
      console.log(error);
    };
  };

  const handlerDeleteNotificationSingle = async (id: any) => {
    const payload = {
      notificationId: id.toString(),
    };
    try {
      void await deleteNotification(payload);
      const backendData: any = await fetchNotification.refetch();
      if (backendData) {
        setTotal(backendData?.data?.notificationList.total);
        setNotifications(backendData?.data?.notificationList?.notifications);
      };
    } catch (error) {
      console.log(error);
    };
  };

  const handlerFetchMore = () => {
    setLimit(limit + 5);
  };

  const ReadAllButton = () => {
    return (
      <div 
        className="flex flex-row gap-3 cursor-pointer"
        onClick={() => {
          void handlerReadNotificationAll();
        }}
      >
        <img className="w-[18px]" src={NotifCheck} />
        <span className='text-[16px] font-semibold text-purple'>{t('user.notification.mark-all-as-read')}</span>
      </div>
    )
  };

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
        <ErrorBoundary FallbackComponent={InternalServerError} key={location.pathname}>
          {
            activatedNotificationPage ? (
              <TitleCard
                hasBack={true}
                backTitle={t('components.organism.back') ?? ''}
                onBackClick={goBack}
                title={t('components.organism.notification')}
                TopSideButtons={<ReadAllButton />}
              >
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row">
                    <CheckBox
                      defaultValue={isSelectedAll}
                      labelTitle={t('user.notification.selected-all')}
                      updateFormValue={(event: any) => {
                        handlerSelectAll(event.value);
                      }}
                    />
                  </div>
                  {
                    selected.length > 0 && (
                      <div className="flex flex-row items-center justify-end gap-3 cursor-pointer">
                        <img className="w-[18px] h-[18px]" src={DeleteSmall} />
                        <p 
                          className="text-[14px] text-body-text-2"
                          onClick={() => {
                            void handlerDeleteNotificationSelected();
                          }}
                        >
                          {t('user.notification.delete')} {t('user.notification.selected')}
                        </p>
                      </div>
                    )
                  }
                </div>
                {
                  notifications.length > 0 ? (
                    <InfiniteScroll
                      className="flex flex-col"
                      dataLength={notifications.length}
                      next={handlerFetchMore}
                      loader={''}
                      hasMore={limit < total}
                      height={900}
                    >
                      {
                        notifications.map((element: any, index: number) => (
                          <div 
                            key={index} 
                            className="flex flex-row border-b-[1px] border-[#D6D6D6] py-4"
                          >
                            <div className="flex items-center">
                              <CheckBox
                                defaultValue={element.isSelected}
                                labelTitle=""
                                updateFormValue={(event: any) => {
                                  handlerSelectOne(event.value, index);
                                }}        
                              />
                            </div>
                            <div 
                              className="flex flex-col flex-1 gap-[4px] cursor-pointer"
                              onClick={() => {
                                void handlerReadNotificationSingle(element.id)
                              }}
                            >
                              <h2 className={`text-[14px] font-bold ${element.isRead ? 'text-body-text-4' : 'text-purple'}`}>{element.title}</h2>
                              <h4 className='text-[16px] text-body-text-2'>{element.content}</h4>
                              <h6 className='text-[14px] text-body-text-1'>{`${dayjs(element.createdAt).format('MMM DD, YYYY')} at ${dayjs(element.createdAt).format('HH:mm')}`}</h6>
                            </div>  
                            <div className="flex items-center justify-end min-w-[100px]">
                              {
                                element.isSelected && (
                                  <div 
                                    className="flex flex-row items-center p-2 gap-2 border-[1px] border-[#D6D6D6] rounded-xl cursor-pointer"
                                    onClick={() => {
                                      void handlerDeleteNotificationSingle(element.id);
                                    }}
                                  >
                                    <img className="w-[18px] h-[18px]" src={DeleteSmall} />
                                    <p className="text-[14px] text-body-text-2">{t('user.notification.delete')}</p>
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        ))
                      }
                    </InfiniteScroll>
                  ) : (
                    <div className="flex justify-center p-[150px]">
                      <img className="w-[150px]" src={NoNotifications} />
                    </div>
                  )
                }
              </TitleCard>
            ) : (
              <React.Fragment>
                <Outlet />
                {props.children}
              </React.Fragment>
            )
          }
        </ErrorBoundary>
      </div>
    </div>
  );
};
export default Layout;
