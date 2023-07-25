import { useCallback, useEffect, useState } from 'react';
import Table from '@/components/molecules/Table';
import PaginationComponent from '@/components/molecules/Pagination';
import StatusBadge from '@/pages/PageManagement/components/StatusBadge';
import { useTranslation } from 'react-i18next';
import { useGetMyTaskListQuery } from '@/services/ContentManager/contentManagerApi';
import { SortingState } from '@tanstack/react-table';

export default function MyTaskTab(props: { id: any }) {
  const { t } = useTranslation();
  const { id } = props;
  const [listData, setListData] = useState<any>([]);

  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(5);
  const [direction, setDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');

  // RTK GET DATA
  const fetchQuery = useGetMyTaskListQuery({
    id,
    pageIndex,
    limit: pageLimit,
    sortBy,
    direction,
  });
  const { data } = fetchQuery;

  useEffect(() => {
    if (data) {
      setListData(data?.contentDataList?.contentDataList);
      setTotal(data?.contentDataList?.total);
    }
  }, [data]);

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    }
  }, []);

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
      accessorKey: 'shortDesc',
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
          onSortModelChange={handleSortModelChange}
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
