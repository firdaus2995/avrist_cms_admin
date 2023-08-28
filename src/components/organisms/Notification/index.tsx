import dayjs from "dayjs";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NotifCheck from '../../../assets/notif-check.svg';
import NoNotifications from '../../../assets/no-notifications.svg';
import DeleteSmall from '../../../assets/delete-small.svg';
import { TitleCard } from "@/components/molecules/Cards/TitleCard";
import { CheckBox } from "@/components/atoms/Input/CheckBox";
import { copyArray } from "@/utils/logicHelper";

const Notification = ({
  limit,
  setLimit,
  total,
  setTotal,
  seeNotification,
  fetchNotification,
}: any) => {
  const navigate = useNavigate();
  
  const [isSelectedAll, setIsSelectedAll] = useState<any>(false);
  const [notifications, setNotifications] = useState<any>([]);
  const [selected, setSelected] = useState<any>(0);

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

    void loadFirst();
  }, []);

  useEffect(() => {
    const selected = notifications.filter((element: any) => {
      if (element.isSelected === true) {
        return element;
      } else {
        return false;
      };
    });

    setSelected(selected.length);
    if (selected.length === notifications.length) {
      setIsSelectedAll(true);
    } else {
      setIsSelectedAll(false)
    };
  }, [JSON.stringify(notifications)]);

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

  const goBack = () => {
    navigate(-1);
  };

  const handlerReadAll = () => {
    console.log("READ_ALL");
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

  const handlerFetchMore = () => {
    setLimit(limit + 5);
  };

  const ReadAllButton = () => {
    return (
      <div 
        className="flex flex-row gap-3 cursor-pointer"
        onClick={() => {
          handlerReadAll();
        }}
      >
        <img className="w-[18px]" src={NotifCheck} />
        <span className='text-[16px] font-semibold text-purple'>Mark All as Read</span>
      </div>
    )
  };

  return (
    <TitleCard
      hasBack={true}
      backTitle="Back"
      onBackClick={goBack}
      title="Notification"
      TopSideButtons={<ReadAllButton />}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <CheckBox
            defaultValue={isSelectedAll}
            labelTitle="Select All"
            updateFormValue={(event: any) => {
              handlerSelectAll(event.value);
            }}
          />
        </div>
        {
          selected > 0 && (
            <div className="flex flex-row items-center justify-end gap-3 cursor-pointer">
              <img className="w-[18px] h-[18px]" src={DeleteSmall} />
              <p className="text-[14px] text-body-text-2">Clear All Notifications</p>
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
            height={1050}
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
                  <div className="flex flex-col flex-1 gap-[4px]">
                    <h2 className={`text-[14px] font-bold ${element.isRead ? 'text-body-text-4' : 'text-purple'}`}>{element.title}</h2>
                    <h4 className='text-[16px] text-body-text-2'>{element.content}</h4>
                    <h6 className='text-[14px] text-body-text-1'>{`${dayjs(element.createdAt).format('MMM DD, YYYY')} at ${dayjs(element.createdAt).format('HH:mm')}`}</h6>
                  </div>  
                  <div className="flex items-center justify-end min-w-[100px]">
                    {
                      element.isSelected && (
                        <div className="flex flex-row items-center p-2 gap-2 border-[1px] border-[#D6D6D6] rounded-xl cursor-pointer">
                          <img className="w-[18px] h-[18px]" src={DeleteSmall} />
                          <p className="text-[14px] text-body-text-2">Delete</p>
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
  )
};

export default Notification;
