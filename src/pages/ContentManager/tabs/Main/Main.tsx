import { useState } from 'react';
import Table from '@/components/molecules/Table';
import PaginationComponent from '@/components/molecules/Pagination';
import TableDelete from '@/assets/table-delete.png';
import { useTranslation } from 'react-i18next';
import ModalConfirmLeave from '@/components/molecules/ModalConfirm';
import TimelineLog from '@/assets/timeline-log.svg';
import WarningIcon from '@/assets/warning.png';
import StatusBadge from '../../components/StatusBadge';
import ModalLog from '../../components/ModalLog';

export default function MainTab(_props: { id: any }) {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setMessageConfirm] = useState('');
  const [, setIdDelete] = useState(0);

  const [listData] = useState<any>([
    {
      id: 1,
      status: 'waiting_review',
      title: 'Homepage Avrist Life',
      desc: 'Landing Page',
    },
    {
      id: 2,
      status: 'waiting_approval',
      title: 'Homepage Avrist Life 2',
      desc: 'Landing Page',
    },
    {
      id: 3,
      status: 'draft',
      title: 'title',
      desc: 'description',
    },
  ]);

  // TABLE PAGINATION STATE
  const [total] = useState(3);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(5);

  const [idLog, setIdLog] = useState(null);
  const [logTitle, setLogTitle] = useState(null);

  const COLUMNS = [
    {
      header: () => <span className="text-[14px]"></span>,
      accessorKey: 'status',
      enableSorting: false,
      cell: (info: any) => (
        <>
          <StatusBadge
            status={
              info.getValue() && info.getValue() !== '' && info.getValue() !== null
                ? info.getValue()
                : '-'
            }
          />
          <div className="ml-3 cursor-pointer tooltip" data-tip="Log"
          onClick={() => {
            setIdLog(info?.row?.original?.id);
            setLogTitle(info?.row?.original?.title);
          }}>
            <img src={TimelineLog} className="w-6 h-6" />
            {/* <p>{info?.row?.original?.id}</p> */}
          </div>
        </>
      ),
    },
    {
      header: () => <span className="text-[14px] font-black">Title</span>,
      accessorKey: 'title',
      enableSorting: true,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px] font-black">Short Description</span>,
      accessorKey: 'desc',
      enableSorting: true,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px] font-black">{t('action.action')}</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (_info: any) => (
        <div className="flex gap-5">
          <div className="tooltip" data-tip={'View Detail'}>
            <div
              role="button"
              className="p-1 px-4 border rounded-md border-primary bg-white font-medium text-primary">
              View Detail
            </div>
          </div>
          <div className="tooltip" data-tip={t('action.delete')}>
            <img
              className={`cursor-pointer select-none flex items-center justify-center`}
              src={TableDelete}
              onClick={() => {
                onClickPageDelete(_info.getValue(), _info?.row?.original?.title);
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  const onClickPageDelete = (id: number, title: string) => {
    setIdDelete(id);
    setTitleConfirm('Are you sure?');
    setMessageConfirm(`Do you want to delete data ${title}?`);
    setShowConfirm(true);
  };

  return (
    <>
      <ModalConfirmLeave
        open={showConfirm}
        cancelAction={() => {
          setShowConfirm(false);
        }}
        title={titleConfirm}
        cancelTitle="No"
        message={messageConfirm}
        submitAction={() => {
          setShowConfirm(false);
        }}
        submitTitle="Yes"
        // loading={deletePageLoading}
        icon={WarningIcon}
        btnType={''}
      />
      <ModalLog
        id={idLog}
        open={!!idLog}
        toggle={() => {
          setIdLog(null);
        }}
        title={`Log Approval - ${logTitle}`}
      />
      <div className="overflow-x-auto w-full mb-5">
        <Table
          rows={listData}
          columns={COLUMNS}
          loading={false}
          error={false}
          manualPagination={true}
          manualSorting={true}
        />
      </div>
      <PaginationComponent
        total={total}
        page={pageIndex}
        pageSize={pageLimit}
        setPageSize={(page: number) => {
          setPageLimit(page);
          setPageIndex(0);
        }}
        setPage={(page: number) => {
          setPageIndex(page);
        }}
      />
    </>
  );
}
