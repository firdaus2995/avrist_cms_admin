import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Table from '@/components/molecules/Table';
import type { SortingState } from '@tanstack/react-table';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import PaginationComponent from '@/components/molecules/Pagination';
import dayjs from 'dayjs';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import {
  useGetArchiveDataQuery,
  useHardDeleteContentDataMutation,
  useRestoreContentDataMutation,
} from '@/services/ContentManager/contentManagerApi';
import { useGetRoleQuery } from '@/services/User/userApi';
import Typography from '@/components/atoms/Typography';
import TableDelete from '@/assets/table-delete.svg';
import WarningIcon from '@/assets/warning.png';
import { useTranslation } from 'react-i18next';
import { getCredential } from '@/utils/Credential';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

export default function PageManagementArchive() {
  const { t } = useTranslation();
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

  const [deleteContentManager, { isLoading: deleteContentManagerLoading }] =
    useHardDeleteContentDataMutation();

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
  const [restoreData, { isLoading }] = useRestoreContentDataMutation();

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
        };
      });
      setRoleData(roleList);
    }
  }, [fetchedRole]);

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
    }else{
      setSortBy('id');
      setDirection('desc');
    }
  }, []);

  const onClickPageRestore = (id: number, title: string) => {
    setRestoreId(id);
    setRestoreModalTitle(t('user.content-manager-archive.pageManagementArchive.restoreModal.title') ?? '');
    setRestoreModalBody(
      t('user.content-manager-archive.pageManagementArchive.restoreModal.message', { title }) ?? ''
    );
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
            title: t('user.content-manager-archive.toasts.successRestore.title'),
            message: t('user.content-manager-archive.toasts.successRestore.message', { title: result.contentDataRestore.message }),
          }),
        );
        setPageIndex(0);
        await fetchQuery.refetch();
      })
      .catch((error: any) => {
        setOpenRestoreModal(false);
        dispatch(
          openToast({
            type: 'error',
            title: t('user.content-manager-archive.toasts.errorRestore.title'),
            message: t(`errors.content-manager.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  const COLUMNS = [
    {
      header: () => <span className="text-[14px]">{t('user.content-manager-archive.pageManagementArchive.tableHeaders.title')}</span>,
      accessorKey: 'title',
      enableSorting: true,
      cell: (info: any) => (
        <Link to={`../content-manager/${id}/detail/${info?.row?.original?.id}`}>
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
      header: () => <span className="text-[14px]">{t('user.content-manager-archive.pageManagementArchive.tableHeaders.shortDescription')}</span>,
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
      header: () => <span className="text-[14px]">{t('user.content-manager-archive.pageManagementArchive.tableHeaders.categoryName')}</span>,
      accessorKey: 'categoryName',
      enableSorting: true,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? dayjs(info.getValue()).format('user.content-manager-archive.DD/MM/YYYY')
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">{t('user.content-manager-archive.pageManagementArchive.tableHeaders.action')}</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-3">
          <button
            onClick={() => {
              onClickPageRestore(info.getValue(), info?.row?.original?.title);
            }}
            className="btn btn-primary text-xs btn-sm w-28">
            {t('user.content-manager-archive.pageManagementArchive.tableHeaders.restore')}
          </button>
          {canDelete && (
            <div className="tooltip" data-tip={t('user.content-manager-archive.action.delete')}>
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableDelete}
                onClick={() => {
                  onClickPageDelete(info.getValue(), info?.row?.original?.title);
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
      if (element === 'CONTENT_MANAGER_DELETE') {
        return true;
      }
      return false;
    });
  });

  const onClickPageDelete = (id: number, title: string) => {
    setIdDelete(id);
    setTitleConfirm(t('user.content-manager-archive.pageManagementArchive.confirmModal.title') ?? '');
    setMessageConfirm(t('user.content-manager-archive.pageManagementArchive.confirmModal.message', { title }) ?? '');
    setShowConfirm(true);
  };

  const submitDeleteContent = () => {
    deleteContentManager({ id: idDelete })
      .unwrap()
      .then(async d => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.content-manager-archive.toasts.successDeleteContent.title'),
            message: t('user.content-manager-archive.toasts.successDeleteContent.message', { title: d.pageDelete.message }),
          }),
        );
        await fetchQuery.refetch();
      })
      .catch(() => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'error',
            title: t('user.content-manager-archive.toasts.errorDeleteContent.title'),
            message: t('user.content-manager-archive.toasts.errorDeleteContent.message'),
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
        cancelTitle={t('user.content-manager-archive.buttons.cancel')}
        message={restoreModalBody}
        submitAction={submitRestorePage}
        submitTitle={t('user.content-manager-archive.buttons.yes')}
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
        cancelTitle={t('user.content-manager-archive.buttons.cancel')}
        message={messageConfirm}
        submitAction={submitDeleteContent}
        submitTitle={t('user.content-manager-archive.buttons.yes')}
        loading={deleteContentManagerLoading}
        icon={WarningIcon}
        btnSubmitStyle={'btn-error'}
      />
      <TitleCard
        title={t('user.content-manager-archive.pageManagementArchive.title')}
        topMargin="mt-2"
        SearchBar={
          <InputSearch
            onBlur={(e: any) => {
              setSearch(e.target.value);
            }}
            placeholder={t('user.content-manager-archive.pageManagementArchive.searchPlaceholder') ?? ''}
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
