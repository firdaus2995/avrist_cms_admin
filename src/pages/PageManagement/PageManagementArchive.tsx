import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import {
  useGetPageManagementListQuery,
  useRestorePageMutation,
  // useDeletePageMutation,
  useDeletePageHardMutation,
} from '@/services/PageManagement/pageManagementApi';
import Table from '@/components/molecules/Table';
import type { SortingState } from '@tanstack/react-table';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import PaginationComponent from '@/components/molecules/Pagination';
import dayjs from 'dayjs';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import { getCredential } from '@/utils/Credential';
import TableDelete from '@/assets/table-delete.svg';
import WarningIcon from '@/assets/warning.png';
import { useTranslation } from 'react-i18next';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

export default function PageManagementArchive() {
  const dispatch = useAppDispatch();
  const [listData, setListData] = useState<any>([]);

  // GO BACK
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const { t } = useTranslation();

  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [direction, setDirection] = useState('desc');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');

  // RESTORE MODAL STATE
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [restoreModalTitle, setRestoreModalTitle] = useState('');
  const [restoreModalBody, setRestoreModalBody] = useState('');
  const [restoreId, setRestoreId] = useState(0);

  const [showConfirm, setShowConfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setMessageConfirm] = useState('');
  const [idDelete, setIdDelete] = useState(0);

  // RTK GET DATA
  const fetchQuery = useGetPageManagementListQuery(
    {
      pageIndex,
      limit: pageLimit,
      sortBy,
      direction,
      search,
      filterBy: '',
      startDate: '',
      endDate: '',
      isArchive: true,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const { data, isFetching } = fetchQuery;

  // RTK RESTORE
  const [restorePage, { isLoading }] = useRestorePageMutation();

  // RTK DELETE
  const [pageHardDelete, { isLoading: deletePageLoading }] = useDeletePageHardMutation();

  useEffect(() => {
    if (data) {
      setListData(data?.pageList?.pages);
      setTotal(data?.pageList?.total);
    }
  }, [data]);

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    } else {
      setSortBy('id');
      setDirection('desc');
    }
  }, []);

  const onClickPageRestore = (id: number, title: string) => {
    setRestoreId(id);
    setRestoreModalTitle(t('user.page-management.archive.restore-confirm.title') ?? '');
    setRestoreModalBody(t('user.page-management.archive.restore-confirm.message', { title }) ?? '');
    setOpenRestoreModal(true);
  };

  // FUNCTION FOR restore USER
  const submitRestorePage = () => {
    restorePage({
      id: restoreId,
    })
      .unwrap()
      .then(async () => {
        setOpenRestoreModal(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.page-management.archive.restore.success'),
            message: t('user.page-management.archive.restore.success-message'),
          }),
        );
        await fetchQuery.refetch();
      })
      .catch((error: any) => {
        setOpenRestoreModal(false);
        dispatch(
          openToast({
            type: 'error',
            title: t('user.page-management.archive.restore.failed'),
            message: t(
              `errors.page-management.restore.${errorMessageTypeConverter(error.message)}`,
            ),
          }),
        );
      });
  };

  const COLUMNS = [
    {
      header: () => (
        <span className="text-[14px]">{t('user.page-management.archive.row.page-name')}</span>
      ),
      accessorKey: 'title',
      enableSorting: true,
      cell: (info: any) => {
        // const id = info.row.original.id;
        return (
          // <Link to={`/page-management/detail/${id}`}>
          <p className="text-[14px] truncate truncate max-w-[100px] 2xl:max-w-[300px]">
            {info.getValue() && info.getValue() !== '' && info.getValue() !== null
              ? info.getValue()
              : '-'}
          </p>
          // </Link>
        );
      },
    },
    {
      header: () => (
        <span className="text-[14px]">{t('user.page-management.archive.row.created-by')}</span>
      ),
      accessorKey: 'createdBy.name',
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
        <span className="text-[14px]">{t('user.page-management.archive.row.created-date')}</span>
      ),
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
      header: () => (
        <span className="text-[14px]">{t('user.page-management.archive.row.updated-date')}</span>
      ),
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
      header: () => (
        <span className="text-[14px]">{t('user.page-management.archive.row.action')}</span>
      ),
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-3">
          <button
            onClick={() => {
              onClickPageRestore(info.getValue(), info?.row?.original?.title);
            }}
            className="btn btn-primary text-xs btn-sm w-28">
            {t('user.page-management.archive.row.restore')}
          </button>
          {canDelete && (
            <div className="tooltip" data-tip={t('action.delete')}>
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableDelete}
                onClick={() => {
                  onClickPageDelete(info.getValue());
                }}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  const [canDelete] = useState(() => {
    return !!getCredential().roles.find((element: any) => {
      if (element === 'PAGE_DELETE') {
        return true;
      }
      return false;
    });
  });

  const onClickPageDelete = (id: number) => {
    setIdDelete(id);
    setTitleConfirm(t('user.page-management.archive.delete-confirm.title') ?? '');
    setMessageConfirm(t('user.page-management.archive.delete-confirm.message') ?? '');
    setShowConfirm(true);
  };

  // FUNCTION FOR DELETE PAGE
  const submitDeletePage = () => {
    pageHardDelete({ id: idDelete })
      .unwrap()
      .then(async d => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.page-management.list.delete.success'),
            message: d.pageHardDelete.message,
          }),
        );
        await fetchQuery.refetch();
      })
      .catch((error: any) => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'error',
            title: t('user.page-management.list.delete.failed'),
            message: t(`errors.page-management.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  return (
    <>
      <ModalConfirm
        open={openRestoreModal}
        cancelAction={() => {
          setOpenRestoreModal(false);
        }}
        title={restoreModalTitle}
        cancelTitle={t('user.page-management.archive.cancel')}
        message={restoreModalBody}
        submitAction={submitRestorePage}
        submitTitle={t('user.page-management.archive.submit-title')}
        loading={isLoading}
        btnSubmitStyle={'btn-primary'}
        icon={undefined}
      />
      <ModalConfirm
        open={showConfirm}
        cancelAction={() => {
          setShowConfirm(false);
        }}
        title={titleConfirm}
        cancelTitle={t('user.page-management.archive.cancel')}
        message={messageConfirm}
        submitAction={submitDeletePage}
        submitTitle={t('user.page-management.archive.submit-title')}
        loading={deletePageLoading}
        icon={WarningIcon}
        btnSubmitStyle={'btn-error'}
      />
      <TitleCard
        title={t('user.page-management.archive.title-card')}
        topMargin="mt-2"
        SearchBar={
          <InputSearch
            onBlur={(e: any) => {
              setSearch(e.target.value);
              setPageIndex(0);
            }}
            placeholder={t('user.page-management.archive.search-placeholder') ?? ''}
          />
        }
        onBackClick={goBack}
        hasBack={true}>
        <div className="overflow-x-auto w-full mb-5">
          <Table
            rows={listData}
            columns={COLUMNS}
            loading={isFetching}
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
