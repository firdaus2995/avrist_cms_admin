import { useState } from 'react';
import Table from '@/components/molecules/Table';
import PaginationComponent from '@/components/molecules/Pagination';
import TableDelete from '@/assets/table-delete.png';
import { useTranslation } from 'react-i18next';
import StatusBadge from '@/pages/PageManagement/components/StatusBadge';
import ModalConfirmLeave from '@/components/molecules/ModalConfirm';
import WarningIcon from '@/assets/warning.png';

export default function MainTab(_props: { id: any; }) {
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
      desc: 'Landing Page'
    },
    {
      id: 2,
      status: 'waiting_approval',
      title: 'Homepage Avrist Life 2',
      desc: 'Landing Page'
    },
    {
      id: 3,
      status: 'draft',
      title: 'title',
      desc: 'description'
    }
  ]);

  // TABLE PAGINATION STATE
  const [total] = useState(3);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(5);

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
        </>
      ),
    },
    {
      header: () => <span className="text-[14px]">Title</span>,
      accessorKey: 'title',
      enableSorting: false,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">Short Description</span>,
      accessorKey: 'desc',
      enableSorting: false,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">{t('action.action')}</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (_info: any) => (
        <div className="flex gap-5">
          <div className="tooltip" data-tip={'View Detail'}>
            <button className='btn btn-outline btn-primary'>View Detail</button>
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
        cancelTitle="Cancel"
        message={messageConfirm}
        submitAction={() => { setShowConfirm(false); }}
        submitTitle="Yes"
        // loading={deletePageLoading}
        icon={WarningIcon}
        btnType={''}
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
