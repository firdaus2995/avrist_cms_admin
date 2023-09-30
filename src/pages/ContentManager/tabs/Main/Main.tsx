import { useCallback, useEffect, useState } from 'react';
import Table from '@/components/molecules/Table';
import PaginationComponent from '@/components/molecules/Pagination';
import TableDelete from '@/assets/table-delete.svg';
import { useTranslation } from 'react-i18next';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import TimelineLog from '@/assets/timeline-log.svg';
import WarningIcon from '@/assets/warning.png';
import ModalLog from '../../components/ModalLog';
import { useDeleteContentDataMutation, useGetContentDataQuery } from '@/services/ContentManager/contentManagerApi';
import { SortingState } from '@tanstack/react-table';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';

export default function MainTab(props: { id: any, isUseCategory: any }) {
  const dispatch = useAppDispatch();
  const { id, isUseCategory } = props;
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setMessageConfirm] = useState('');
  const [idDelete, setIdDelete] = useState(0);

  const [listData, setListData] = useState<any>([]);

  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [direction, setDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');

  // RTK GET DATA
  const fetchQuery = useGetContentDataQuery({
    id,
    pageIndex,
    limit: pageLimit,
    sortBy,
    direction,
  });
  const { data } = fetchQuery;

  const [idLog, setIdLog] = useState(null);
  const [logTitle, setLogTitle] = useState(null);

  // RTK DELETE
  const [deleteContentData, { isLoading: deleteContentDataLoading }] = useDeleteContentDataMutation();

  useEffect(() => {
    if (data) {
      setListData(data?.contentDataList?.contentDataList);
      setTotal(data?.contentDataList?.total);
    }
  }, [data]);

  useEffect(() => {
    void fetchQuery.refetch()
  }, [])

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    }
  }, []);

  const COLUMNS = [
    {
      header: () => <span className="text-[14px]"></span>,
      accessorKey: 'status',
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
            data-tip={t('user.tabs-main.common.action.log')}
            onClick={() => {
              setIdLog(info?.row?.original?.id);
              setLogTitle(info?.row?.original?.title);
            }}>
            <img src={TimelineLog} className="w-6 h-6" />
            {/* <p>{info?.row?.original?.id}</p> */}
          </div>
        </>
      ),
    },
    {
      header: () => <span className="text-[14px] font-black">{t('user.tabs-main.common.id')}</span>,
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
      header: () => <span className="text-[14px] font-black">{t('user.tabs-main.common.title')}</span>,
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
      header: () => <span className="text-[14px] font-black">{t('user.tabs-main.common.shortDescription')}</span>,
      accessorKey: 'shortDesc',
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
      header: () => <span className="text-[14px] font-black">{t('user.tabs-main.common.categoryName')}</span>,
      accessorKey: 'categoryName',
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
      header: () => <span className="text-[14px] font-black">{t('user.tabs-main.common.action.action')}</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-3">
          <Link to={`detail/${info.getValue()}`}>
            <div className="tooltip" data-tip={t('user.tabs-main.common.action.viewDetail')}>
              <div
                role="button"
                className="p-1 px-4 border rounded-md border-primary bg-white font-medium text-primary text-xs">
                {t('user.tabs-main.common.action.viewDetail')}
              </div>
            </div>
          </Link>
          <div className="tooltip" data-tip={t('user.tabs-main.common.action.delete')}>
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

  if (!isUseCategory) {
    const categoryColumnIndex = COLUMNS.findIndex(column => column.accessorKey === 'categoryName');
    if (categoryColumnIndex !== -1) {
      COLUMNS.splice(categoryColumnIndex, 1);
    }
  }

  const onClickPageDelete = (id: number, title: string) => {
    setIdDelete(id);
    setTitleConfirm(t('user.tabs-main.mainTab.titleConfirm') ?? '');
    setMessageConfirm(t('user.tabs-main.mainTab.deleteDataMessage', { title }) ?? '');
    setShowConfirm(true);
  };

   // FUNCTION FOR DELETE PAGE
   const submitDeletePage = () => {
    deleteContentData({ id: idDelete })
      .unwrap()
      .then(async _d => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.tabs-main.common.successDeletePage'),
            message: 'Success! Your data has been successfully deleted!',
          }),
        );
        await fetchQuery.refetch();
      })
      .catch(() => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'error',
            title: t('user.tabs-main.common.failedDeletePage'),
            message: t('user.tabs-main.common.somethingWentWrong'),
          }),
        );
      });
  };

  return (
    <>
      <ModalConfirm
        open={showConfirm}
        cancelAction={() => {
          setShowConfirm(false);
        }}
        title={titleConfirm}
        cancelTitle={t('user.tabs-main.common.no')}
        message={messageConfirm}
        submitAction={submitDeletePage}
        submitTitle={t('user.tabs-main.common.yes')}
        loading={deleteContentDataLoading}
        icon={WarningIcon}
        btnSubmitStyle={''}
      />
      <ModalLog
        id={idLog}
        open={!!idLog}
        toggle={() => {
          setIdLog(null);
        }}
        title={t('user.tabs-main.modalLog.logApprovalTitle', { logTitle })}
      />
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
    </>
  );
}
