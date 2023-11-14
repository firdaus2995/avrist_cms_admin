import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useGetRolesQuery, useRoleHapusMutation } from '../../services/Roles/rolesApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import Table from '../../components/molecules/Table';
import TableEdit from '../../assets/table-edit.png';
import TableDelete from '../../assets/table-delete.svg';
import WarningIcon from '../../assets/warning.png';
import { InputSearch } from '../../components/atoms/Input/InputSearch';
import PaginationComponent from '../../components/molecules/Pagination';
import { SortingState } from '@tanstack/react-table';
import { t } from 'i18next';
import RoleRenderer from '../../components/atoms/RoleRenderer';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

const CreateButton = () => {
  return (
    <RoleRenderer allowedRoles={['ROLE_CREATE']}>
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
              {t('user.roles-list.common.addNewRole')}
            </div>
          </button>
        </Link>
      </div>
    </RoleRenderer>
  );
};

export default function RolesList() {
  const dispatch = useAppDispatch();
  const [showComfirm, setShowComfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setmessageConfirm] = useState('');
  const [idDelete, setIdDelete] = useState(0);

  const [deleteRole, { isLoading: deleteRoleLoading }] = useRoleHapusMutation();
  const [search, setSearch] = useState('');
  const [listData, setListData] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [direction, setDirection] = useState('desc');
  const [sortBy, setSortBy] = useState('id');

  const fetchQuery = useGetRolesQuery(
    {
      pageIndex,
      limit: pageLimit,
      direction,
      search,
      sortBy,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data, isFetching, isError } = fetchQuery;

  const onConfirm = (id: number, name: string) => {
    setIdDelete(id);
    setTitleConfirm(t('user.roles-list.common.areYouSure') ?? '');
    setmessageConfirm(t('user.roles-list.common.deleteRoleConfirmation', { name }) ?? '');
    setShowComfirm(true);
  };

  const onDelete = () => {
    deleteRole({ id: idDelete })
      .unwrap()
      .then(async d => {
        setShowComfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.roles-list.common.successDelete'),
            message: d.roleDelete.message,
          }),
        );
        await fetchQuery.refetch();
      })
      .catch((error: any) => {
        setShowComfirm(false);
        dispatch(
          openToast({
            type: 'error',
            title: t('user.roles-list.common.failedDelete'),
            message: t(`errors.role.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  useEffect(() => {
    if (data) {
      setListData(data?.roleList?.roles);
      setTotal(data?.roleList?.total);
    }
  }, [data]);

  useEffect(() => {
    void fetchQuery.refetch();
  }, []);

  const COLUMNS = [
    {
      header: () => <span className="text-[14px]">{t('user.roles-list.common.roleID')}</span>,
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
      header: () => <span className="text-[14px]">{t('user.roles-list.common.roleName')}</span>,
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
      header: () => <span className="text-[14px]">{t('user.roles-list.common.description')}</span>,
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
      header: () => <span className="text-[14px]">{t('user.roles-list.common.action')}</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-3">
          <RoleRenderer allowedRoles={['ROLE_EDIT']}>
            <Link to={`edit/${info.getValue()}`}>
              <div className="tooltip" data-tip="Edit">
                <img
                  className={`cursor-pointer select-none flex items-center justify-center`}
                  src={TableEdit}
                />
              </div>
            </Link>
          </RoleRenderer>
          <RoleRenderer allowedRoles={['ROLE_DELETE']}>
            <div className="tooltip" data-tip="Delete">
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableDelete}
                onClick={() => {
                  onConfirm(info.getValue(), info?.row?.original?.name);
                }}
              />
            </div>
          </RoleRenderer>
        </div>
      ),
    },
  ];

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

  return (
    <>
      <RoleRenderer allowedRoles={['ROLE_READ']}>
        <ModalConfirm
          open={showComfirm}
          cancelAction={() => {
            setShowComfirm(false);
          }}
          title={titleConfirm}
          cancelTitle={t('user.roles-list.common.cancel')}
          message={messageConfirm}
          submitAction={onDelete}
          submitTitle={t('user.roles-list.common.yes')}
          loading={deleteRoleLoading}
          icon={WarningIcon}
          btnSubmitStyle={''}
        />
        <TitleCard
          title={t('user.roles-list.common.roleList')}
          topMargin="mt-2"
          SearchBar={
            <InputSearch
              onBlur={(e: any) => {
                setSearch(e.target.value);
              }}
              placeholder={t('user.roles-list.common.searchPlaceholder') ?? ''}
            />
          }
          TopSideButtons={<CreateButton />}>
          <div className="overflow-x-auto w-full mb-5">
            <Table
              rows={listData || ''}
              columns={COLUMNS}
              loading={isFetching}
              error={isError}
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
      </RoleRenderer>
    </>
  );
}
