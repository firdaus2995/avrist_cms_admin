import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import {
  useGetGlobalConfigDataListQuery,
  useDeleteGlobalConfigDataMutation,
} from '@/services/GlobalConfigData/globalConfigDataApi';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import Table from '@/components/molecules/Table';
import type { SortingState } from '@tanstack/react-table';
import TableEdit from '@/assets/table-edit.png';
import TableDelete from '@/assets/table-delete.svg';
import WarningIcon from '@/assets/warning.png';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import PaginationComponent from '@/components/molecules/Pagination';
import { getCredential } from '@/utils/Credential';
import { t } from 'i18next';
import RoleRenderer from '../../components/atoms/RoleRenderer';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

const TopRightButton = () => {
  return (
    <div className="flex flex-row">
      <CreateButton />
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
            {t('user.global-config-data-list.addNewData')}
          </div>
        </button>
      </Link>
    </div>
  );
};

export default function GlobalConfigDataList() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [listData, setListData] = useState<any>([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setMessageConfirm] = useState('');
  const [idDelete, setIdDelete] = useState(0);

  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [direction, setDirection] = useState('desc');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');

  // RTK GET DATA
  const fetchQuery = useGetGlobalConfigDataListQuery({
    pageIndex,
    limit: pageLimit,
    direction,
    search,
    sortBy,
  });
  const { data } = fetchQuery;

  // RTK DELETE
  const [deleteData, { isLoading: deleteDataLoading }] = useDeleteGlobalConfigDataMutation();

  useEffect(() => {
    if (data) {
      setListData(data?.configList?.configs);
      setTotal(data?.configList?.total);
    }
  }, [data]);

  useEffect(() => {
    const refetch = async () => {
      await fetchQuery.refetch();
    };
    void refetch();
  }, []);

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

  // TABLE COLUMN
  const COLUMNS = [
    {
      header: () => (
        <span className="text-[14px]">{t('user.global-config-data-list.columns.key')}</span>
      ), // Update with i18n
      accessorKey: 'variable',
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
        <span className="text-[14px]">{t('user.global-config-data-list.columns.value')}</span>
      ), // Update with i18n
      accessorKey: 'value',
      enableSorting: false,
      cell: (info: any) => (
        <p className="text-[14px] truncate w-56">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-'}
        </p>
      ),
    },
    {
      header: () => (
        <span className="text-[14px]">{t('user.global-config-data-list.columns.description')}</span>
      ), // Update with i18n
      accessorKey: 'description',
      enableSorting: false,
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
        <span className="text-[14px]">{t('user.global-config-data-list.action.action')}</span>
      ),
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-3 w-20">
          {canEdit && (
            <Link to={`edit/${info.row?.original?.id}`}>
              <div className="tooltip" data-tip={t('user.global-config-data-list.action.edit')}>
                <img
                  className={`cursor-pointer select-none flex items-center justify-center`}
                  src={TableEdit}
                />
              </div>
            </Link>
          )}
          {canDelete && (
            <div className="tooltip" data-tip={t('user.global-config-data-list.action.delete')}>
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableDelete}
                onClick={() => {
                  onClickDelete(info.getValue(), info?.row?.original?.variable);
                }}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  const [canCreate] = useState(() => {
    return !!getCredential().roles.find((element: any) => {
      if (element === 'GLOBAL_CONFIG_CREATE') {
        return true;
      }
      return false;
    });
  });

  const [canEdit] = useState(() => {
    return !!getCredential().roles.find((element: any) => {
      if (element === 'GLOBAL_CONFIG_EDIT') {
        return true;
      }
      return false;
    });
  });

  const [canDelete] = useState(() => {
    return !!getCredential().roles.find((element: any) => {
      if (element === 'GLOBAL_CONFIG_DELETE') {
        return true;
      }
      return false;
    });
  });

  const onClickDelete = (id: number, title: string) => {
    setIdDelete(id);
    setTitleConfirm(t('user.global-config-data-list.modalConfirm.title') ?? '');
    setMessageConfirm(t('user.global-config-data-list.modalConfirm.message', { title }) ?? '');
    setShowConfirm(true);
  };

  // FUNCTION FOR DELETE PAGE
  const submitDeleteData = () => {
    deleteData({ id: idDelete })
      .unwrap()
      .then(async () => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.global-config-data-list.toast.successDeletePage'),
          }),
        );
        if (listData?.length === 1) {
          setPageIndex(pageIndex - 1);
        }
        await fetchQuery.refetch();
      })
      .catch((error: any) => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'error',
            title: t('user.global-config-data-list.toast.failedDeletePage'),
            message: t(`errors.global-config.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  return (
    <>
      <RoleRenderer allowedRoles={['GLOBAL_CONFIG_READ']}>
        <ModalConfirm
          open={showConfirm}
          cancelAction={() => {
            setShowConfirm(false);
          }}
          title={titleConfirm}
          cancelTitle={t('user.global-config-data-list.modalConfirm.cancelTitle')}
          message={messageConfirm}
          submitAction={submitDeleteData}
          submitTitle={t('user.global-config-data-list.modalConfirm.submitTitle')}
          loading={deleteDataLoading}
          icon={WarningIcon}
          btnSubmitStyle={'btn-error'}
        />
        <TitleCard
          title={t('user.global-config-data-list.title')}
          topMargin="mt-2"
          SearchBar={
            <InputSearch
              onBlur={(e: any) => {
                setSearch(e.target.value);
              }}
              placeholder={t('user.global-config-data-list.searchPlaceholder') ?? ''}
            />
          }
          TopSideButtons={canCreate && <TopRightButton />}>
          <div className="w-full mb-5">
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
      </RoleRenderer>
    </>
  );
}
