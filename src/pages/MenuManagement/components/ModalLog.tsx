import { useEffect, useState } from 'react';
import UserLog from '@/assets/user-log.svg';
import dayjs from 'dayjs';
import Typography from '@/components/atoms/Typography';
import { LoadingCircle } from '@/components/atoms/Loading/loadingCircle';
import { useGetMenuLogListQuery } from '@/services/Menu/menuApi';
import InfiniteScroll from 'react-infinite-scroll-component';
// import data from './dummy.json';

export default function ModalLog(props: any) {
  const { open, title, toggle } = props;

  const [listData, setListData] = useState<any>([]);
  const [limit, setLimit] = useState(10);

  const { data, isFetching, isError } = useGetMenuLogListQuery(
    {
      pageIndex: 0,
      limit,
      sortBy: 'createdAt',
      direction: 'desc',
      search: '',
    },
    { refetchOnMountOrArgChange: true },
  );

  // const isFetching = false

  useEffect(() => {
    if (data) {
      setListData(data.menuLogList?.menuLogs);
    }
  }, [data]);

  const handlerFetchMore = () => {
    setLimit(limit + 10);
  };

  const Card = ({ date, datas }: any) => {
    const actionType = (action: string) => {
      if (action === 'CREATE') {
        return ['Add Page', 'Added by'];
      } else if (action === 'UPDATE') {
        return ['Edit Page', 'Edited by'];
      } else if (action === 'CHANGE_STRUCTURE') {
        return ['Change Structure', 'Changed by'];
      } else if (action === 'TAKE_DOWN') {
        return ['Takedown Page', 'Takedown by'];
      } else {
        return ['', 'Published By'];
      }
    };

    return (
      <div className="flex">
        <div className="w-5">
          {date && (
            <div className="flex flex-col justify-center items-center">
              <Typography type="body" size="m" weight="bold">
                {dayjs(date).format('D')}
              </Typography>
              <Typography type="body" size="xs">
                {dayjs(date).format('MMM')}
              </Typography>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center w-10">
          <div>
            <div className="flex items-center bg-[#ABA2B8] justify-center w-4 h-4 border-2 border-[#D6D6D6] rounded-full"></div>
          </div>
          <div className="w-px h-full border-r-2 border-[#D6D6D6]" />
        </div>

        <div className="relative flex-1 mb-10 bg-[#FBF8FF] rounded-lg">
          <div className="w-full h-full z-20 px-6 py-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-1">
                  {datas?.action !== 'PUBLISH' ? (
                    <Typography type="body" size="m" weight="semi" className="truncate w-[300px]">
                      {`${actionType(datas?.action)[0]}: ${datas?.title}`}
                    </Typography>
                  ) : null}
                  <div className="flex flex-row gap-3">
                    <Typography type="body" size="m" weight="semi">
                      {actionType(datas?.action)[1]}
                    </Typography>
                    <img src={UserLog} alt="User" width={18} height={18} />
                    <Typography type="body" size="m" weight="regular">
                      {datas?.createdBy}
                    </Typography>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center">
                    <Typography type="body" size="s">
                      {dayjs(datas?.createdAt).format('DD/MM/YYYY')}
                    </Typography>
                    <div className="border-r h-5 border-black mx-5" />
                    <Typography type="body" size="s">
                      {dayjs(datas?.createdAt).format('HH:mm')}
                    </Typography>
                  </div>
                  <div className="flex justify-end">
                    <Typography type="body" size="s" weight="regular" className="text-body-text-1">
                      {datas?.role}
                    </Typography>
                  </div>
                </div>
              </div>
              {datas?.takedownNote && (
                <div className="w-[455px]">
                  <div className="flex flex-row justify-center opacity-80 truncate">
                    <Typography type="body" size="s" weight="regular" className="w-full truncate">
                      Comment: {datas?.takedownNote}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`modal ${open ? 'modal-open' : ''}`}>
      <div className="modal-box overflow-hidden  w-11/12 max-w-2xl">
        <div>
          <Typography type="body" size="l" weight="semi" className="truncate mb-3">
            {title}
          </Typography>
          <button
            onClick={() => toggle()}
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        <div className="sticky px-4 py-8 border rounded-xl border-gray max-h-[calc(100vh-10rem)]">
          {isFetching && (
            <div className="flex justify-center items-center">
              <LoadingCircle />
            </div>
          )}
          <div>
            {!isError && data ? (
              <InfiniteScroll
                className="pr-3"
                dataLength={listData.length}
                next={handlerFetchMore}
                loader={''}
                hasMore={limit < data.menuLogList?.total}
                height={500}>
                {listData.length > 0 &&
                  listData.map((item: any, index: number) => {
                    const prevDate = listData[index - 1]?.createdAt.slice(0, 10) || '';
                    const currentDate = item.createdAt.slice(0, 10);
                    return (
                      <Card
                        date={currentDate !== prevDate ? item.createdAt : ''}
                        datas={item}
                        key={index}
                      />
                    );
                  })}
              </InfiniteScroll>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
