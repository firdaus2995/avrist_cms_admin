import dayjs from 'dayjs';
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
import RoleRenderer from '../../components/atoms/RoleRenderer';
import StatusBadge from '@/components/atoms/StatusBadge';
import ModalLog from './components/ModalLog';
import TimelineLog from '@/assets/timeline-log.svg';
import Typography from '@/components/atoms/Typography';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { InputSearch } from '../../components/atoms/Input/InputSearch';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { useDeleteGroupMenuMutation, useGetGroupMenuQuery } from '@/services/Menu/menuApi';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

export default function GroupMenuList () {  
  // TABLE COLUMN
  const columns = [
    {
      header: () => <span className="text-[14px]"></span>,
      accessorKey: 'status',
      enableSorting: false,
      cell: (info: any) => {
        return (
          <>
            <StatusBadge status={info.getValue()} />
            <div
              className="cursor-pointer tooltip"
              data-tip="Log"
              onClick={() => {
                setIdMenuLogModal(info?.row?.original?.id ?? 0);
                setShowMenuLogModal(true);
              }}>
              <img src={TimelineLog} className="w-6 h-6" />
            </div>
          </>
        );
      },
    },
    {
      header: () => (
        <span className="text-[14px]">{t('user.menu-list.menuGroup.table.columns.name')}</span>
      ),
      accessorKey: 'name',
      enableSorting: true,
      cell: (info: any) => (
        <Link to={`menu/${info?.row?.original.id ?? 0}`}>
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
    {
      header: () => (
        <span className="text-[14px]">{t('user.menu-list.menuGroup.table.columns.lastPublishedAt')}</span>
      ),
      accessorKey: 'lastPublishedAt',
      enableSorting: true,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? dayjs(info.getValue()).format('MMM DD, YYYY')
            : '-'}
        </p>
      ),
    },
    {
      header: () => (
        <span className="text-[14px]">{t('user.menu-list.menuGroup.table.columns.lastPublishedBy')}</span>
      ),
      accessorKey: 'lastPublishedBy',
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
        <span className="text-[14px]">{t('user.menu-list.menuGroup.table.columns.action')}</span>
      ),
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-3">
          <RoleRenderer allowedRoles={['MENU_EDIT']}>
            <Link to={`edit/${info.getValue()}`}>
              <div className="tooltip" data-tip="Edit">
                <img
                  className={`cursor-pointer select-none flex items-center justify-center min-w-[34px]`}
                  src={TableEdit}
                />
              </div>
            </Link>
          </RoleRenderer>
          <RoleRenderer allowedRoles={['MENU_TAKEDOWN']}>
            <div className="tooltip" data-tip="Delete">
              <img
                className={`cursor-pointer select-none flex items-center justify-center min-w-[34px]`}
                src={TableDelete}
                onClick={() => {
                  onClickGroupMenuDelete(info.getValue(), info?.row?.original?.name);
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
  // MENU LOG MODAL
  const [showMenuLogModal, setShowMenuLogModal] = useState(false);
  const [idMenuLogModal, setIdMenuLogModal] = useState(0);

  // RTK GET DATA
  const fetchQuery = useGetGroupMenuQuery(
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
  const [deleteGroupMenu, { isLoading }] = useDeleteGroupMenuMutation();

  useEffect(() => {
    setPageIndex(0);
  }, [search])

  useEffect(() => {
    if (data) {
      setListData(data?.groupMenuList?.menuGroups);
      setTotal(data?.groupMenuList?.total);
    };
  }, [data]);

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    } else {
      setSortBy('id');
      setDirection('desc');
    };
  }, []);

  // FUNCTION FOR DELETE GROUP MENU
  const submitDeleteGroupMenu = () => {
    deleteGroupMenu({
      id: deletedId,
    })
      .unwrap()
      .then(async (result: any) => {
        setOpenDeleteModal(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.menu-list.menuGroup.toast.success-delete'),
            message: result.menuGroupDelete.message,
          }),
        );
        await fetchQuery.refetch();
        setPageIndex(0);
      })
      .catch((error: any) => {
        setOpenDeleteModal(false);
        dispatch(
          openToast({
            type: 'error',
            title: t('user.menu-list.menuGroup.toast.failed-delete'),
            message: t(`errors.menu.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  const onClickGroupMenuDelete = (id: number, name: string) => {
    setDeletedId(id);
    setDeleteModalTitle(t('user.menu-list.menuGroup.modal.delete-menu-title') ?? '');
    setDeleteModalBody(
      t('user.menu-list.menuGroup.modal.delete-menu-body', { name }) ?? '',
    );
    setOpenDeleteModal(true);
  };

  return (
    <>
      <RoleRenderer allowedRoles={['MENU_READ']}>
        <ModalConfirm
          open={openDeleteModal}
          cancelAction={() => {
            setOpenDeleteModal(false);
          }}
          title={deleteModalTitle}
          message={deleteModalBody}
          cancelTitle={t('user.menu-list.menuGroup.modal.button-cancel')}
          submitTitle={t('user.menu-list.menuGroup.modal.button-submit')}
          submitAction={submitDeleteGroupMenu}
          loading={isLoading}
          icon={WarningIcon}
          btnSubmitStyle=""
        />
        <ModalLog
          id={idMenuLogModal}
          open={showMenuLogModal}
          toggle={() => {
            setShowMenuLogModal(!showMenuLogModal);
          }}
          title={'Activity Log - Menu Management'}
        />
        <TitleCard
          title={t('user.menu-list.menuGroup.texts.list.title')}
          topMargin="mt-2"
          TopSideButtons={
            <RoleRenderer allowedRoles={['MENU_CREATE']}>
              <Link to="new" className="btn btn-primary flex flex-row gap-2 rounded-xl">
                <img src={Plus} className="w-[24px] h-[24px]" />
                {t('user.menu-list.menuGroup.buttons.create-menu')}
              </Link>
            </RoleRenderer>
          }
          SearchBar={
            <InputSearch
              onBlur={(e: any) => {
                setSearch(e.target.value);
              }}
              placeholder={t('user.menu-list.menuGroup.inputs.search-placeholder') ?? ''}
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
