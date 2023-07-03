import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { useGetPostTypeListQuery } from '../../services/ContentType/contentTypeApi';
import Table from '@/components/molecules/Table';
import type { SortingState } from '@tanstack/react-table';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import PaginationComponent from '@/components/molecules/Pagination';
import Typography from '@/components/atoms/Typography';

export default function ContentManagerList() {
  const [listData, setListData] = useState<any>([]);

  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(5);
  const [direction, setDirection] = useState('asc');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');

  // RTK GET DATA
  const fetchQuery = useGetPostTypeListQuery({
    pageIndex,
    limit: pageLimit,
    direction,
    search,
    sortBy,
  });
  const { data } = fetchQuery;

  useEffect(() => {
    if (data) {
      setListData(data?.postTypeList?.postTypeList);
      setTotal(data?.postTypeList?.total);
    }
  }, [data]);

  useEffect(() => {
    const refetch = async () => {
      await fetchQuery.refetch();
    };
    void refetch();
  }, []);

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    }
  }, []);

  // TABLE COLUMN
  const COLUMNS = [
    {
      header: () => <span className="text-[14px]">Content Type Name</span>,
      accessorKey: 'name',
      enableSorting: true,
      cell: (info: any) => (
        <Link to={`${info?.row?.original?.id}`}>
          <Typography
            type="body"
            size="s"
            weight="semi"
            className="truncate cursor-pointer text-primary">
            {info.getValue() && info.getValue() !== '' && info.getValue() !== null
              ? info.getValue()
              : '-'}
          </Typography>
        </Link>
      ),
    },
  ];

  return (
    <>
      <TitleCard
        title="Content Manager"
        topMargin="mt-2"
        SearchBar={
          <InputSearch
            onBlur={(e: any) => {
              setSearch(e.target.value);
            }}
            placeholder="Search"
          />
        }>
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
      </TitleCard>
    </>
  );
}
