import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Table from '@/components/molecules/Table';
import PaginationComponent from '@/components/molecules/Pagination';
import TableEdit from '@/assets/table-edit.png';
import { useGetCategoryListQuery } from '@/services/ContentManager/contentManagerApi';
import { SortingState } from '@tanstack/react-table';
import { getCredential } from '@/utils/Credential';

export default function CategoryTab(_props: { id: any }) {
  const COLUMNS = [
    {
      header: () => <span className="text-[14px] font-black">Category Name</span>,
      accessorKey: 'name',
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
      header: () => <span className="text-[14px] font-black">Category Description</span>,
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
      header: () => <span className="text-[14px] font-black">{t('action.action')}</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (_info: any) => (
        <div className="flex gap-5">
          {
            canEdit && (
              <Link to={`category/edit/${_info.getValue()}`}>
                <div className="tooltip" data-tip={t('action.edit')}>
                  <img
                    className={`cursor-pointer select-none flex items-center justify-center`}
                    src={TableEdit}
                  />
                </div>
              </Link>
            )
          }
        </div>
      ),
    },
  ];

  const { t } = useTranslation();
  const [listData, setListData] = useState([]);
  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(5);
  const [direction, setDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  // PERMISSION STATE
  const [canEdit] = useState(() => {
    return !!getCredential().roles.find((element: any) => {
      if (element === "CONTENT_MANAGER_EDIT") {
        return true;
      }
      return false;
    });
  })  

  // RTK GET DATA
  const fetchQuery = useGetCategoryListQuery({
    postTypeId: _props.id,
    pageIndex,
    limit: pageLimit,
    sortBy,
    direction,
  }, {
    refetchOnMountOrArgChange: true,
  })
  const { data, isFetching, isError } = fetchQuery;

  useEffect(() => {
    if (data) {
      setListData(data?.categoryList?.categoryList);
      setTotal(data?.categoryList?.total);
    };
  }, [data]);

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {    
    if (sortModel.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    };
  }, []);  

  return (
    <>
      <div className="overflow-x-auto w-full mb-5">
        <Table
          rows={listData}
          columns={COLUMNS}
          loading={isFetching}
          error={isError}
          onSortModelChange={handleSortModelChange}
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
