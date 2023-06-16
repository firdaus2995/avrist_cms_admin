import { useEffect, useState } from 'react';
import Modal from '../../../../components/atoms/Modal';
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
        <div className="w-9 -mt-4">
          {date && (
            <div className="flex flex-col justify-center items-center">
              <Typography type="body" size="xl" weight="bold">
                {dayjs(date).format('D')}
              </Typography>
              <Typography type="body" size="s" weight="light">
                {dayjs(date).format('MMM')}
              </Typography>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center w-14">
          <div>
            <div className="flex items-center bg-[#ABA2B8] justify-center w-4 h-4 border-2 border-[#D6D6D6] rounded-full"></div>
          </div>
          <div className="w-px h-full border-r-2 border-[#D6D6D6]" />
        </div>

        <div className="relative flex-1 mb-10 bg-[#FBF8FF] rounded-lg">
          <div className="relative z-20 p-6">
            <div className="flex justify-between mb-4 items-center">
              <Typography type="body" size="m" weight="medium">
                {datas?.pageStatus}
              </Typography>
              <div className="flex flex-row items-center">
                <Typography type="body" size="m" weight="light">
                  {dayjs(datas?.logCreatedAt).format('DD/MM/YYYY')}
                </Typography>
                <div className="border-r h-5 border-black mx-5" />
                <Typography type="body" size="m" weight="light">
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
    <Modal open={open} toggle={toggle} title={title}>
      <div className="px-4 py-10 border rounded-xl border-gray">
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
    </Modal>
  );
}
