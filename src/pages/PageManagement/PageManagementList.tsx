import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import {
  useGetPageManagementListQuery,
  useDeletePageMutation,
  useGetPageMyTaskListQuery,
} from '@/services/PageManagement/pageManagementApi';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import Table from '@/components/molecules/Table';
import type { SortingState } from '@tanstack/react-table';

import TableDelete from '@/assets/table-delete.svg';
import ArchiveBox from '@/assets/archive-box.svg';
import TimelineLog from '@/assets/timeline-log.svg';
import WarningIcon from '@/assets/warning.png';

import { InputSearch } from '@/components/atoms/Input/InputSearch';
import PaginationComponent from '@/components/molecules/Pagination';
import StatusBadge from './components/StatusBadge';
import ModalLog from './components/ModalLog';
import dayjs from 'dayjs';
import { FilterButton } from '@/components/molecules/FilterButton/index.';

const ArchiveButton = () => {
  return (
    <div className="inline-block float-right">
      <Link to="archive">
        <button className=" border-secondary-warning border-[1px] rounded-xl w-36 py-3">
          <div className="flex flex-row gap-2 items-center justify-center text-xs normal-case font-bold text-secondary-warning">
            <img src={ArchiveBox} className="w-6 h-6 mr-1" />
            Archive
          </div>
        </button>
      </Link>
    </div>
  );
};

const CreateButton = () => {
  return (
    <div className="inline-block float-right">
      <Link to="new">
        <button className="btn normal-case btn-primary text-xs whitespace-nowrap">
          <div className="flex flex-row gap-2 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create New Page
          </div>
        </button>
      </Link>
    </div>
  );
};

export default function PageManagementList() {
  const listTabs = [
    {
      name: 'Page List',
      isActive: 1,
    },
    {
      name: 'My Task',
      isActive: 2,
    },
  ];
  const now = dayjs().format('YYYY-MM-DD');
  const [filterOpen, setFilterOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(1);
  const isPageListActive = activeTab === 1;
  const dispatch = useAppDispatch();
  const [listData, setListData] = useState<any>([]);
  const [listDataMyTask, setListDataMyTask] = useState<any>([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setMessageConfirm] = useState('');
  const [idDelete, setIdDelete] = useState(0);
  const [idLog, setIdLog] = useState(null);
  const [logTitle, setLogTitle] = useState(null);

  const [filterBy, setFilterBy] = useState('CREATED_AT');
  const [startDate, setStartDate] = useState(now);
  const [endDate, setEndDate] = useState(now);

  // TABLE PAGINATION STATE - PAGE LIST
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);

  const [directionPageList, setDirectionPageList] = useState('asc');
  const [directionMyTask, setDirectionMyTask] = useState('asc');

  const [searchPageList, setSearchPageList] = useState('');
  const [searchMyTask, setSearchMyTask] = useState('');
  const [sortByPageList, setSortByPageList] = useState('id');
  const [sortByMyTask, setSortByMyTask] = useState('id');

  const sortBy = isPageListActive ? sortByPageList : sortByMyTask;
  const direction = isPageListActive ? directionPageList : directionMyTask;
  const searchQuery = isPageListActive ? searchPageList : searchMyTask;

  // RTK GET DATA
  const fetchQuery = useGetPageManagementListQuery({
    pageIndex,
    limit: pageLimit,
    sortBy,
    direction,
    search: searchQuery,
    filterBy,
    startDate,
    endDate,
    isArchive: false,
  });
  const { data } = fetchQuery;

  const fetchQueryMyTask = useGetPageMyTaskListQuery({
    pageIndex,
    limit: pageLimit,
    sortBy,
    direction,
    search: searchQuery,
    isArchive: false,
  });
  const { data: dataMyTask } = fetchQueryMyTask;

  // RTK DELETE
  const [deletePage, { isLoading: deletePageLoading }] = useDeletePageMutation();

  useEffect(() => {
    if (data && isPageListActive) {
      setListData(data?.pageList?.pages);
      setTotal(data?.pageList?.total);
    }
    if (dataMyTask && !isPageListActive) {
      setListDataMyTask(dataMyTask?.pageList?.pages);
      setTotal(dataMyTask?.pageList?.total);
    }
  }, [data, dataMyTask, isPageListActive]);

  useEffect(() => {
    const refetchData = async () => {
      if (isPageListActive) {
        await fetchQuery.refetch();
      } else {
        await fetchQueryMyTask.refetch();
      }
    };
    void refetchData();
  }, [isPageListActive]);

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback(
    (sortModel: SortingState) => {
      if (sortModel.length) {
        const sortBy = sortModel[0].id;
        const direction = sortModel[0].desc ? 'desc' : 'asc';

        if (isPageListActive) {
          setSortByPageList(sortBy);
          setDirectionPageList(direction);
        } else {
          setSortByMyTask(sortBy);
          setDirectionMyTask(direction);
        }
      }
    },
    [isPageListActive],
  );

  // TABLE COLUMN
  const COLUMNS = [
    {
      header: () => <span className="text-[14px]"></span>,
      accessorKey: 'pageStatus',
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
          <div
            className="ml-3 cursor-pointer tooltip"
            data-tip="Log"
            onClick={() => {
              setIdLog(info?.row?.original?.id);
              setLogTitle(info?.row?.original?.title);
            }}>
            <img src={TimelineLog} className="w-6 h-6" />
          </div>
        </>
      ),
    },
    {
      header: () => <span className="text-[14px]">Page Name</span>,
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
      header: () => <span className="text-[14px]">Created by</span>,
      accessorKey: 'createdBy.name',
      enableSorting: true,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() ? info.getValue() : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">Created Date</span>,
      accessorKey: 'createdAt',
      enableSorting: true,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? dayjs(info.getValue()).format('DD/MM/YYYY')
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">Updated Date</span>,
      accessorKey: 'updatedAt',
      enableSorting: true,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? dayjs(info.getValue()).format('DD/MM/YYYY')
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">Action</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-3">
          <Link to={`detail/${info.getValue()}`}>
            <div className="tooltip" data-tip={'View Detail'}>
              <button className="h-[34px] border-box border-[1px] border-purple rounded-[6px] text-purple px-3 text-xs">
                View Detail
              </button>
            </div>
          </Link>
          <div className="tooltip" data-tip="Delete">
            <img
              className={`cursor-pointer select-none flex items-center justify-center`}
              src={TableDelete}
              onClick={() => {
                onClickPageDelete(info.getValue(), info?.row?.original?.title);
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
    setMessageConfirm(`Do you want to delete ${title} from the list?`);
    setShowConfirm(true);
  };

  // FUNCTION FOR DELETE PAGE
  const submitDeletePage = () => {
    deletePage({ id: idDelete })
      .unwrap()
      .then(async d => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: 'Success Delete Page',
            message: d.pageDelete.message,
          }),
        );
        await fetchQuery.refetch();
      })
      .catch(() => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed Delete Page',
            message: 'Something went wrong!',
          }),
        );
      });
  };

  const resetState = () => {
    setFilterBy('CREATED_AT');
    setStartDate(now);
    setEndDate(now);
  };

  const TopRightButton = () => {
    return (
      <div className="flex flex-row">
        {isPageListActive && (
          <FilterButton
            open={filterOpen}
            setOpen={setFilterOpen}
            startDate={startDate}
            endDate={endDate}
            defaultSelected={filterBy}
            onSubmit={(e: any) => {
              setFilterBy(e.selection);
              setStartDate(e.startDate);
              setEndDate(e.endDate);
              setFilterOpen(false);
            }}
            onResetFilter={() => {
              resetState();
            }}
            onCancelPress={() => {
              setFilterOpen(false);
              resetState();
            }}
          />
        )}
        <CreateButton />
      </div>
    );
  };

  return (
    <>
      <ModalLog
        id={idLog}
        open={!!idLog}
        toggle={() => {
          setIdLog(null);
        }}
        title={`Log Approval - ${logTitle}`}
      />
      <ModalConfirm
        open={showConfirm}
        cancelAction={() => {
          setShowConfirm(false);
        }}
        title={titleConfirm}
        cancelTitle="Cancel"
        message={messageConfirm}
        submitAction={submitDeletePage}
        submitTitle="Yes"
        loading={deletePageLoading}
        icon={WarningIcon}
        btnSubmitStyle={''}
      />
      <TitleCard
        title="Page List"
        topMargin="mt-2"
        SearchBar={
          <InputSearch
            onBlur={(e: any) => {
              if (isPageListActive) {
                setSearchPageList(e.target.value);
              } else {
                setSearchMyTask(e.target.value);
              }
            }}
            placeholder="Search"
          />
        }
        TopSideButtons={<TopRightButton />}>
        <div className="flex flex-row justify-between mb-5">
          <div className="btn-group">
            {listTabs.map(val => (
              <button
                key={val.isActive}
                onClick={() => {
                  setFilterOpen(false);
                  resetState();
                  setActiveTab(val.isActive);
                }}
                className={`btn ${
                  activeTab === val.isActive ? 'btn-primary' : 'bg-gray-200 text-gray-500'
                } text-xs w-40`}>
                {val.name}
              </button>
            ))}
          </div>
          {isPageListActive && <ArchiveButton />}
        </div>
        <div className="overflow-x-auto w-full mb-5">
          {isPageListActive ? (
            <Table
              rows={listData}
              columns={COLUMNS}
              loading={false}
              error={false}
              manualPagination={true}
              manualSorting={true}
              onSortModelChange={handleSortModelChange}
            />
          ) : (
            <Table
              rows={listDataMyTask}
              columns={COLUMNS}
              loading={false}
              error={false}
              manualPagination={true}
              manualSorting={true}
              onSortModelChange={handleSortModelChange}
            />
          )}
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
