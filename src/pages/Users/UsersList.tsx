import { SortingState } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { t } from 'i18next';

import Table from '../../components/molecules/Table';
import Plus from '../../assets/plus.png';
import PaginationComponent from '../../components/molecules/Pagination';
import WarningIcon from '../../assets/warning.png';
import TableEdit from '../../assets/table-edit.png';
import TableDelete from '../../assets/table-delete.svg';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { InputSearch } from '../../components/atoms/Input/InputSearch';
import { useDeleteUserMutation, useGetUserQuery } from '../../services/User/userApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import Typography from '@/components/atoms/Typography';

export default function UsersList() {
  const StatusBadge = (status: boolean) => {
    let style = '';
    let title = '';
    if (status) {
      style = 'bg-[#D9E7D6] border-[#8AA97C]';
      title = 'Active';
    } else {
      style = 'bg-[#EBD2CE] border-[#D09191]';
      title = 'Inactive';
    }

    const badgeClasses = `flex w-28 items-center justify-center text-gray h-7 border-2 ${style}`;
    return (
      <span className={badgeClasses}>
        <Typography type="body" size="xs" weight="medium">
          {title}
        </Typography>
      </span>
    );
  };
  // TABLE COLUMN
  const columns = [
    {
      header: () => <span className="text-[14px]"></span>,
      accessorKey: 'isActive',
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
      header: () => <span className="text-[14px]">User ID</span>,
      accessorKey: 'userId',
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
      header: () => <span className="text-[14px]">User Name</span>,
      accessorKey: 'fullName',
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
      header: () => <span className="text-[14px]">Email</span>,
      accessorKey: 'email',
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
      header: () => <span className="text-[14px]">Role</span>,
      accessorKey: 'role.name',
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
        <div className="flex gap-3">
          <Link to={`edit/${info.getValue()}`}>
            <img
              className={`cursor-pointer select-none flex items-center justify-center`}
              src={TableEdit}
            />
          </Link>
          <img
            className={`cursor-pointer select-none flex items-center justify-center`}
            src={TableDelete}
            onClick={() => {
              onClickUserDelete(info.getValue(), info?.row?.original?.fullName);
            }}
          />
        </div>
      ),
    },
  ];

  const dispatch = useAppDispatch();
  const [listData, setListData] = useState([]);
  const [search, setSearch] = useState('');
  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [direction, setDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  // DELETE MODAL STATE
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteModalTitle, setDeleteModalTitle] = useState('');
  const [deleteModalBody, setDeleteModayBody] = useState('');
  const [deletedId, setDeletedId] = useState(0);

  // RTK GET DATA
  const fetchQuery = useGetUserQuery(
    {
      pageIndex,
      limit: pageLimit,
      sortBy,
      direction,
      search,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data, isFetching, isError } = fetchQuery;
  // RTK DELETE
  const [deletedUser, { isLoading }] = useDeleteUserMutation();

  useEffect(() => {
    if (data) {
      setListData(data?.userList?.users);
      setTotal(data?.userList?.total);
    }
  }, [data]);

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      const listedColumn: any = {
        userId: 'username',
        fullName: 'name',
      };
      setSortBy(listedColumn[sortModel[0].id] ?? sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    }
  }, []);

  // FUNCTION FOR DELETE USER
  const submitDeleteUser = () => {
    deletedUser({
      id: deletedId,
    })
      .unwrap()
      .then(async (result: any) => {
        setOpenDeleteModal(false);
        dispatch(
          openToast({
            type: 'success',
            title: 'Success Delete User',
            message: result.userDelete.message,
          }),
        );
        await fetchQuery.refetch();
        setPageIndex(0);
      })
      .catch(() => {
        setOpenDeleteModal(false);
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed Delete User',
            message: 'Something went wrong!',
          }),
        );
      });
  };

  const onClickUserDelete = (id: number, name: string) => {
    setDeletedId(id);
    setDeleteModalTitle(`Are you sure?`);
    setDeleteModayBody(
      `Do you want to delete user ${name}? \n Once you delete this user, this user won't be recovered`,
    );
    setOpenDeleteModal(true);
  };

  return (
    <React.Fragment>
      <ModalConfirm
        open={openDeleteModal}
        cancelAction={() => {
          setOpenDeleteModal(false);
        }}
        title={deleteModalTitle}
        message={deleteModalBody}
        cancelTitle="Cancel"
        submitTitle="Yes"
        submitAction={submitDeleteUser}
        loading={isLoading}
        icon={WarningIcon}
        btnSubmitStyle=""
      />
      <TitleCard
        title={t('user.list.title')}
        topMargin="mt-2"
        TopSideButtons={
          <Link to="new" className="btn btn-primary flex flex-row gap-2 rounded-xl">
            <img src={Plus} className="w-[24px] h-[24px]" />
            {t('user.list.button-add')}
          </Link>
        }
        SearchBar={
          <InputSearch
            onBlur={(e: any) => {
              setSearch(e.target.value);
            }}
            placeholder="Search"
          />
        }>
        <Table
          rows={listData}
          columns={columns}
          manualPagination={true}
          manualSorting={true}
          onSortModelChange={handleSortModelChange}
          loading={isFetching}
          error={isError}
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
  );
}
