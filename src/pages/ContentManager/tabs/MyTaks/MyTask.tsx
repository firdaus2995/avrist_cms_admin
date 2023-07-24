import { useState } from 'react';
import Table from '@/components/molecules/Table';
import PaginationComponent from '@/components/molecules/Pagination';
import StatusBadge from '@/pages/PageManagement/components/StatusBadge';
import { useTranslation } from 'react-i18next';

export default function MyTaskTab(_props: { id: any }) {
  const { t } = useTranslation();
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
      header: () => <span className="text-[14px] font-black">ID</span>,
      accessorKey: 'id',
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
      header: () => <span className="text-[14px] font-black">Title</span>,
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
      header: () => <span className="text-[14px] font-black">Short Description</span>,
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
        </div>
      ),
    },
  ];

  return (
    <>
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
