import { useCallback, useEffect, useState } from 'react';
import Table from '@/components/molecules/Table';
import PaginationComponent from '@/components/molecules/Pagination';
import { useTranslation } from 'react-i18next';
import { useGetMyTaskListQuery } from '@/services/ContentManager/contentManagerApi';
import { SortingState } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';

export default function MyTaskTab(props: { id: any }) {
  const { t } = useTranslation();
  const { id } = props;
  const [listData, setListData] = useState<any>([]);

  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [direction, setDirection] = useState('desc');
  const [sortBy, setSortBy] = useState('id');

  // RTK GET DATA
  const fetchQuery = useGetMyTaskListQuery({
    postTypeId: id,
    pageIndex,
    limit: pageLimit,
    sortBy,
    direction,
  });
  const { data } = fetchQuery;

  useEffect(() => {
    if (data) {
      setListData(data?.contentDataMyTaskList?.contentDataList);
      setTotal(data?.contentDataMyTaskList?.total);
    }
  }, [data]);

  useEffect(() => {
    void fetchQuery.refetch()
  }, [])

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    }else{
      setSortBy('id');
      setDirection('desc');
    }
  }, []);

  const COLUMNS = [
    {
      header: () => <span className="text-[14px]">{t('user.tabs-mytask.myTaskTab.tableHeaders.status')}</span>,
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
      header: () => <span className="text-[14px] font-black">{t('user.tabs-mytask.myTaskTab.tableHeaders.id')}</span>,
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
      header: () => <span className="text-[14px] font-black">{t('user.tabs-mytask.myTaskTab.tableHeaders.title')}</span>,
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
      header: () => <span className="text-[14px] font-black">{t('user.tabs-mytask.myTaskTab.tableHeaders.shortDescription')}</span>,
      accessorKey: 'shortDesc',
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
      header: () => <span className="text-[14px] font-black">{t('user.tabs-mytask.myTaskTab.tableHeaders.actions')}</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-3">
          <Link to={`detail/${info.getValue()}`}>
            <div className="tooltip" data-tip={t('user.tabs-mytask.myTaskTab.buttons.viewDetail')}>
              <button className="h-[34px] border-box border-[1px] border-purple rounded-[6px] text-purple px-3 text-xs">
                {t('user.tabs-mytask.myTaskTab.buttons.viewDetail')}
              </button>
            </div>
          </Link>
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
