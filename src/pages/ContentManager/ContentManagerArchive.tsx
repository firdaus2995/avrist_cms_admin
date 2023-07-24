import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Table from '@/components/molecules/Table';
import type { SortingState } from '@tanstack/react-table';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import PaginationComponent from '@/components/molecules/Pagination';
import dayjs from 'dayjs';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import { useGetArchiveDataQuery, useRestoreDataMutation } from '@/services/ContentManager/contentManagerApi';
import { useGetRoleQuery } from '@/services/User/userApi';

export default function PageManagementArchive() {
  const dispatch = useAppDispatch();
  const [listData, setListData] = useState<any>([]);
  const [, setRoleData] = useState([]);
  
  // GO BACK
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const params = useParams();
  const [id] = useState<any>(Number(params.id));

  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(5);
  const [direction, setDirection] = useState('asc');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');

  // RESTORE MODAL STATE
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [restoreModalTitle, setRestoreModalTitle] = useState('');
  const [restoreModalBody, setRestoreModalBody] = useState('');
  const [restoreId, setRestoreId] = useState(0);

  // RTK GET DATA
  const fetchQuery = useGetArchiveDataQuery({
    id,
    pageIndex,
    limit: pageLimit,
    direction,
    search,
    sortBy,
    archive: true,
  });
  const { data } = fetchQuery;

  const fetchRoleQuery = useGetRoleQuery({});
  const { data: fetchedRole } = fetchRoleQuery;  


  // RTK RESTORE
  const [restoreData, { isLoading }] = useRestoreDataMutation();

  useEffect(() => {
    if (data) {
      setListData(data?.contentDataList?.contentDataList);
      setTotal(data?.contentDataList?.total);
    }
  }, [data]);

  useEffect(() => {
    if (fetchedRole) {
      const roleList = fetchedRole?.roleList?.roles.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        }
      })
      setRoleData(roleList);
    };
  }, [fetchedRole])

  useEffect(() => {
    const refetch = async () => {
      await fetchQuery.refetch();
    };
    void refetch();
  }, []);

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel?.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    }
  }, []);

  const onClickPageRestore = (id: number, title: string) => {
    setRestoreId(id);
    setRestoreModalTitle('Are you sure?');
    setRestoreModalBody(`Do you want to restore ${title} content data?`);
    setOpenRestoreModal(true);
  };

  // FUNCTION FOR restore USER
  const submitRestorePage = () => {
    restoreData({
      id: restoreId,
    })
      .unwrap()
      .then(async (result: any) => {
        setOpenRestoreModal(false);
        dispatch(
          openToast({
            type: 'success',
            title: 'Success Restore Data',
            message: result.pageRestore.message,
          }),
        );
        await fetchQuery.refetch();
      })
      .catch(() => {
        setOpenRestoreModal(false);
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed Restore Data',
            message: 'Something went wrong!',
          }),
        );
      });
  };

  const COLUMNS = [
    {
      header: () => <span className="text-[14px]">Title</span>,
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
      header: () => <span className="text-[14px]">Short Description</span>,
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
      header: () => <span className="text-[14px]">Category Name</span>,
      accessorKey: 'categoryName',
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
        <div className="flex gap-5">
          <button
            onClick={() => {
              onClickPageRestore(info.getValue(), info?.row?.original?.title);
            }}
            className="btn btn-primary text-xs btn-sm w-28">
            Restore
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ModalConfirm
        open={openRestoreModal}
        cancelAction={() => {
          setOpenRestoreModal(false);
        }}
        title={restoreModalTitle}
        cancelTitle="Cancel"
        message={restoreModalBody}
        submitAction={submitRestorePage}
        submitTitle="Yes"
        loading={isLoading}
        btnSubmitStyle={'btn-primary'}
        icon={undefined}
      />
      <TitleCard
        title="Content Manager - Archive List"
        topMargin="mt-2"
        SearchBar={
          <InputSearch
            onBlur={(e: any) => {
              setSearch(e.target.value);
            }}
            placeholder="Search"
          />
        }
        onBackClick={goBack}
        hasBack={true}>
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
