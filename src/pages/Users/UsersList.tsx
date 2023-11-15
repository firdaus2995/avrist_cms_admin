import { SortingState } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { t } from 'i18next';

import Table from '../../components/molecules/Table';
import Plus from '../../assets/plus.png';
import PaginationComponent from '../../components/molecules/Pagination';
import WarningIcon from '../../assets/warning.png';
import TableEdit from '../../assets/table-edit.png';
import TableDelete from '../../assets/table-delete.svg';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import Typography from '@/components/atoms/Typography';
import RoleRenderer from '../../components/atoms/RoleRenderer';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { InputSearch } from '../../components/atoms/Input/InputSearch';
import { useDeleteUserMutation, useGetUserQuery } from '../../services/User/userApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

export default function UsersList() {
  const StatusBadge = (status: any) => {
    function getStyle({ status }: any) {
      if (status) {
        return 'bg-[#D9E7D6] border-[#8AA97C]';
      } else if (status === undefined) {
        return 'bg-[#E4E4E4] border-[#A9AAB5]';
      } else {
        return 'bg-[#EBD2CE] border-[#D09191]';
      }
    }

    function getTitle({ status }: any) {
      if (status) {
        return 'Active';
      } else if (status === undefined) {
        return '-';
      } else {
        return 'Inactive';
      }
    }

    const badgeClasses = `flex w-28 items-center justify-center text-gray h-7 border-2 ${getStyle(
      status,
    )}`;
    
    return (
      <span className={badgeClasses}>
        <Typography type="body" size="xs" weight="medium">
          {getTitle(status)}
        </Typography>
      </span>
    );
  };
  
  // TABLE COLUMN
  const columns = [
    {
      header: () => <span className="text-[14px]"></span>,
      accessorKey: 'statusActive',
      enableSorting: false,
      cell: (info: any) => {
        // console.log('ini info => ', info.getValue());
        return (
          <>
            <StatusBadge status={info.getValue()} />
          </>
        );
      },
    },
    {
      header: () => (
        <span className="text-[14px]">{t('user.users-list.user.list.table.header.userId')}</span>
      ),
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
      header: () => (
        <span className="text-[14px]">{t('user.users-list.user.list.table.header.userName')}</span>
      ),
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
      header: () => (
        <span className="text-[14px]">{t('user.users-list.user.list.table.header.email')}</span>
      ),
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
      header: () => (
        <span className="text-[14px]">{t('user.users-list.user.list.table.header.role')}</span>
      ),
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
      header: () => <span className="text-[14px]">Department</span>,
      accessorKey: 'department.name',
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
      header: () => (
        <span className="text-[14px]">{t('user.users-list.user.list.table.header.action')}</span>
      ),
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-3">
          <RoleRenderer allowedRoles={['USER_EDIT']}>
            <Link to={`edit/${info.getValue()}`}>
              <div className="tooltip" data-tip="Edit">
                <img
                  className={`cursor-pointer select-none flex items-center justify-center`}
                  src={TableEdit}
                />
              </div>
            </Link>
          </RoleRenderer>
          <RoleRenderer allowedRoles={['USER_DELETE']}>
            <div className="tooltip" data-tip="Delete">
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableDelete}
                onClick={() => {
                  onClickUserDelete(info.getValue(), info?.row?.original?.fullName);
                }}
              />
            </div>
          </RoleRenderer>
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
  const [direction, setDirection] = useState('desc');
  const [sortBy, setSortBy] = useState('id');
  // DELETE MODAL STATE
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteModalTitle, setDeleteModalTitle] = useState('');
  const [deleteModalBody, setDeleteModalBody] = useState('');
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
    setPageIndex(0);
  }, [search])

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
    }else{
      setSortBy('id');
      setDirection('desc');
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
            title: t('user.users-list.user.list.toast.success-delete'),
            message: result.userDelete.message,
          }),
        );
        if (listData?.length === 1) {
          setPageIndex(pageIndex - 1);
        }
        await fetchQuery.refetch();
        setPageIndex(0);
      })
      .catch((error: any) => {
        setOpenDeleteModal(false);
        dispatch(
          openToast({
            type: 'error',
            title: t('user.users-list.user.list.toast.failed-delete'),
            message: t(`errors.user.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  const onClickUserDelete = (id: number, name: string) => {
    setDeletedId(id);
    setDeleteModalTitle(t('user.users-list.user.list.modal.delete-title') ?? '');
    setDeleteModalBody(
      t('user.users-list.user.list.modal.delete-body', { name }) ?? '', // Pass the deleted user's name to the translation
    );
    setOpenDeleteModal(true);
  };

  return (
    <>
      <RoleRenderer allowedRoles={['USER_READ']}>
        <ModalConfirm
          open={openDeleteModal}
          cancelAction={() => {
            setOpenDeleteModal(false);
          }}
          title={deleteModalTitle}
          message={deleteModalBody}
          cancelTitle={t('user.users-list.user.list.modal.cancel')}
          submitTitle={t('user.users-list.user.list.modal.yes')}
          submitAction={submitDeleteUser}
          loading={isLoading}
          icon={WarningIcon}
          btnSubmitStyle=""
        />
        <TitleCard
          title={t('user.users-list.user.list.title')}
          topMargin="mt-2"
          TopSideButtons={
            <RoleRenderer allowedRoles={['USER_CREATE']}>
              <Link to="new" className="btn btn-primary flex flex-row gap-2 rounded-xl">
                <img src={Plus} className="w-[24px] h-[24px]" />
                {t('user.users-list.user.list.button-add')}
              </Link>
            </RoleRenderer>
          }
          SearchBar={
            <InputSearch
              onBlur={(e: any) => {
                setSearch(e.target.value);
              }}
              placeholder={t('user.users-list.user.list.search-placeholder') ?? ''}
            />
          }>
          <div className="overflow-x-auto w-full mb-5">
            <Table
              rows={listData}
              columns={columns}
              manualPagination={true}
              manualSorting={true}
              onSortModelChange={handleSortModelChange}
              loading={isFetching}
              error={isError}
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
      </RoleRenderer>
    </>
  );
}
