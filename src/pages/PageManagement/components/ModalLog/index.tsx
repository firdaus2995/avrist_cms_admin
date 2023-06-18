import { useEffect, useState } from 'react';
import UserLog from '../../../../assets/user-log.svg';
import dayjs from 'dayjs';
import Typography from '../../../../components/atoms/Typography';
import { usePageLogApprovalQuery } from '../../../../services/PageManagement/pageManagementApi';
import { LoadingCircle } from '../../../../components/atoms/Loading/loadingCircle';

export default function ModalLog(props: any) {
  const { open, title, toggle, id } = props;

  const [listData, setListData] = useState([]);

  const { data, isLoading } = usePageLogApprovalQuery({ id });

  useEffect(() => {
    if (data) {
      setListData(data?.pageLogApproval?.logs);
    }
  }, [data]);

  const Card = ({ date, datas }: any) => {
    return (
      <div className="flex">
        <div className="w-5 -mt-3">
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
          <div className="relative z-20 p-6">
            <div className="flex justify-between mb-4 items-center">
              <Typography type="body" size="s" weight="semi" className="truncate">
                {datas?.pageStatus}
              </Typography>
              <div className="flex flex-row items-center">
                <Typography type="body" size="s" weight="light">
                  {dayjs(datas?.logCreatedAt).format('DD/MM/YYYY')}
                </Typography>
                <div className="border-r h-5 border-black mx-5" />
                <Typography type="body" size="s" weight="light">
                  {dayjs(datas?.logCreatedAt).format('HH:mm')}
                </Typography>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-row justify-center">
                <img src={UserLog} alt="User" />
                <Typography type="body" size="m" weight="regular" className="ml-3">
                  {datas?.createdByName}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Logs = ({ data }: any) => {
    const { date, value } = data;

    return (
      <div>
        {value.map((item: any, index: number) => (
          <Card date={index === 0 ? date : ''} datas={item} key={index} />
        ))}
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

        <div className="sticky px-4 py-10 border rounded-xl border-gray max-h-[calc(100vh-10rem)] overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center items-center">
              <LoadingCircle />
            </div>
          )}
          <div>
            {listData.map((item, index) => (
              <Logs data={item} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
