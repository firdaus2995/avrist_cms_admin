import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useGetRolesQuery, useRoleHapusMutation } from '../../services/Roles/rolesApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import ModalConfirmLeave from '../../components/molecules/ModalConfirm';
import Table from '../../components/molecules/Table';
import type { SortingState } from '@tanstack/react-table';
import WarningIcon from '../../assets/warning.png';
import { InputSearch } from '../../components/atoms/Input/InputSearch';
import PaginationComponent from '../../components/molecules/Pagination';

export default function PageManagementArchive() {
  const dispatch = useAppDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const [titleConfirm] = useState('');
  const [messageConfirm] = useState('');
  const [idDelete] = useState(0);
  const fetchQuery = useGetRolesQuery({
    pageIndex: 0,
    limit: 100,
    direction: '',
    search: '',
    sortBy: '',
  });
  const { data } = fetchQuery;
  const [hapusRole, { isLoading: hapusLoading }] = useRoleHapusMutation();
  const [searchData, setSearchData] = useState('');
  const [listData, setListData] = useState([]);

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const onDelete = () => {
    hapusRole({ id: idDelete })
      .unwrap()
      .then(async d => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: 'Success delete',
            message: d.roleDelete.message,
          }),
        );
        await fetchQuery.refetch();
      })
      .catch(err => {
        setShowConfirm(false);

        console.log(err);
        dispatch(
          openToast({
            type: 'error',
            title: 'Gagal delete',
            message: 'Oops gagal delete',
          }),
        );
      });
  };

  useEffect(() => {
    if (data) {
      setListData(data?.roleList?.roles);
    }
  }, [data]);

  useEffect(() => {
    void fetchQuery.refetch();
  }, []);

  useEffect(() => {
    const filtered = data?.roleList?.roles?.filter(
      val =>
        val?.id?.includes(searchData) ||
        val?.name?.includes(searchData) ||
        val?.description?.includes(searchData),
    );

    setListData(filtered);
  }, [searchData]);

  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      // setSortBy(sortModel[0].id)
      // setDirection(sortModel[0].desc ? "desc" : "asc")
    }
  }, []);

  const COLUMNS = [
    {
      header: () => <span className="text-[14px]">Page Name</span>,
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
      header: () => <span className="text-[14px]">Created by</span>,
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
      header: () => <span className="text-[14px]">Created Date</span>,
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
      header: () => <span className="text-[14px]">Updated Date</span>,
      accessorKey: 'description',
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
      header: () => <span className="text-[14px]">Action</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-5">
          <button className="btn btn-primary text-xs btn-sm w-28">Restore</button>
        </div>
      ),
    },
  ];

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
        submitAction={onDelete}
        submitTitle="Yes"
        loading={hapusLoading}
        icon={WarningIcon}
        btnType={''}
      />
      <TitleCard
        title="Archive List"
        topMargin="mt-2"
        SearchBar={
          <InputSearch
            value={searchData}
            onChange={e => {
              setSearchData(e.target.value);
            }}
            onBlur={(e: any) => {
              console.log(e);
            }}
            placeholder="Search"
          />
        }
        onBackClick={goBack}
        hasBack={true}>
        <div className="overflow-x-auto w-full mb-5">
          <Table
            rows={listData || ''}
            columns={COLUMNS}
            loading={false}
            error={false}
            manualPagination={true}
            manualSorting={true}
            onSortModelChange={handleSortModelChange}
          />
        </div>
        <PaginationComponent
          page={1}
          setPage={() => null}
          total={100}
          pageSize={10}
          setPageSize={() => null}
        />
      </TitleCard>
    </>
  );
}
