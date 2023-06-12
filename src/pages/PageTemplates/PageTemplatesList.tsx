import React, { useCallback, useState } from "react";
import { TitleCard } from "../../components/molecules/Cards/TitleCard";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { InputSearch } from "../../components/atoms/Input/InputSearch";
import Table from "../../components/molecules/Table";
import { SortingState } from "@tanstack/table-core";
import TableEdit from "../../assets/table-edit.png";
import TableDelete from "../../assets/table-delete.png";
import PaginationComponent from "../../components/molecules/Pagination";

// WILL BE DELETED SOON
const listData = [
  {
    pageId: '00001',
    pageName: 'Singa',
    uploadedBy: 'Farandi'
  },
  {
    pageId: '00002',
    pageName: 'Macan',
    uploadedBy: 'Farandi'
  }
]

export default function PageTemplatesNew () {
  // TABLE COLUMN
  const columns = [
    {
      header: () => <span className="text-[14px]">Page Id</span>,
      accessorKey: 'pageId',
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
      header: () => <span className="text-[14px]">Page Name</span>,
      accessorKey: 'pageName',
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
      header: () => <span className="text-[14px]">Uploaded By</span>,
      accessorKey: 'uploadedBy',
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
      header: () => <span className="text-[14px]">Aksi</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-5">
          <button>
            <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableEdit} />
          </button>
          <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableDelete}
            onClick={() => {
              // onClickUserDelete(info.getValue(), info?.row?.original?.fullName);
            }}
          />
        </div>
      ),
    },
  ];
  
  const [search, setSearch] = useState('');
  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(5);
  const [direction, setDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');

  // RTK GET DATA
  // const fetchQuery = useGetPageTemplate({
  //   pageIndex,
  //   limit: pageLimit,
  //   sortBy,
  //   direction,
  //   search,
  // }, {
  //   refetchOnMountOrArgChange: true,
  // });

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {

    };
  }, []);
  
  return (
    <React.Fragment>
      <TitleCard
        title={t('page-template.list.title')}
        topMargin="mt-2" 
        TopSideButtons={
          <Link to='new' className="btn btn-primary flex flex-row gap-2 rounded-xl">
            {t("page-template.list.button-add")}
          </Link>
        }
        SearchBar={
          <InputSearch 
            onBlur={(e: any) => {
              setSearch(e.target.value);
            }}
            placeholder="Search"
          />
        }
      >
        <Table
          rows={listData}
          columns={columns}
          manualPagination={true}
          manualSorting={true}
          onSortModelChange={handleSortModelChange}
          loading={false}
          error={false}
        />
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
    </React.Fragment>
  )
}
