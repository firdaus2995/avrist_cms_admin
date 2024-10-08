import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import Table from '@/components/molecules/Table';
import type { SortingState } from '@tanstack/react-table';
import TableEdit from '@/assets/table-edit.png';
import TableDelete from '@/assets/table-delete.svg';
import WarningIcon from '@/assets/warning.png';
import PaginationComponent from '@/components/molecules/Pagination';
import Typography from '@/components/atoms/Typography';
import { t } from 'i18next';
import { errorMessageTypeConverter } from '@/utils/logicHelper';
import {
  useDeleteResultTemplateMutation,
  useGetResultTemplateListQuery,
} from '@/services/LeadsGenerator/leadsGeneratorApi';
import dayjs from 'dayjs';

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
            Add Result Template
          </div>
        </button>
      </Link>
    </div>
  );
};

export default function LeadsGeneratorResult() {
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
  const [sortBy, setSortBy] = useState('id');

  // RTK GET DATA
  const fetchQuery = useGetResultTemplateListQuery({
    pageIndex,
    limit: pageLimit,
    direction,
    sortBy,
  });
  const { data } = fetchQuery;

  // RTK DELETE
  const [deleteResultTemplate, { isLoading: deletePageLoading }] =
    useDeleteResultTemplateMutation();

  useEffect(() => {
    if (data) {
      setListData(data?.resultTemplateList?.templates);
      setTotal(data?.resultTemplateList?.total);
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
    } else {
      setSortBy('id');
      setDirection('desc');
    }
  }, []);

  // TABLE COLUMN
  const COLUMNS = [
    {
      header: () => <span className="text-[14px]">No</span>,
      accessorKey: 'no',
      enableSorting: false, // No sorting for serial numbers
      cell: (info: { row: { index: number } }) => (
        <div className="flex justify-center items-center">
          <Typography type="body" size="s" className="truncate">
            {info.row.index + 1} {/* Displaying the row index + 1 */}
          </Typography>
        </div>
      ),
    },
    {
      header: () => <span className="text-[14px]">Result Name</span>,
      accessorKey: 'name',
      enableSorting: true,
      cell: (info: any) => (
        <div className="flex justify-start items-start w-56">
          <Typography type="body" size="s" className="truncate">
            {info.getValue() && info.getValue() !== '' && info.getValue() !== null
              ? info.getValue()
              : '-'}
          </Typography>
        </div>
      ),
    },
    {
      header: () => <span className="text-[14px]">Narrative</span>,
      accessorKey: 'narrative',
      enableSorting: false,
      cell: (info: any) => {
        const parser = new DOMParser();
        const parsedValue = parser.parseFromString(
          info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-',
          'text/html',
        );
        const value = parsedValue.body.textContent;

        return (
          <div className="flex justify-start items-start w-[100px]">
            <p className="text-[14px] truncate">{value}</p>
          </div>
        );
      },
    },
    {
      header: () => <span className="text-[14px]">Disclaimer</span>,
      accessorKey: 'disclaimer',
      enableSorting: false,
      cell: (info: any) => {
        const parser = new DOMParser();
        const parsedValue = parser.parseFromString(
          info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-',
          'text/html',
        );
        const value = parsedValue.body.textContent;

        return (
          <div className="flex justify-start items-start w-[100px]">
            <p className="text-[14px] truncate">{value}</p>
          </div>
        );
      },
    },
    {
      header: () => <span className="text-[14px]">Default Template</span>,
      accessorKey: 'isDefault',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex justify-start items-start w-[50px]">
          <p className="text-[14px] truncate">{info.getValue() ? 'Yes' : 'No'}</p>
        </div>
      ),
    },
    {
      header: () => <span className="text-[14px]">Total Image</span>,
      accessorKey: 'images',
      enableSorting: true,
      cell: (info: any) => (
        <div className="flex justify-start items-start w-[20px]">
          <p className="text-[14px] truncate">
            {info.getValue() && info.getValue() !== '' && info.getValue() !== null
              ? JSON.parse(info.getValue())?.length
              : '-'}
          </p>
        </div>
      ),
    },
    {
      header: () => <span className="text-[14px]">Date Added</span>,
      accessorKey: 'createdAt',
      enableSorting: true,
      cell: (info: any) => (
        <div className="flex justify-start items-start w-[100px]">
          <p className="text-[14px] truncate">
            {info.getValue() && info.getValue() !== '' && info.getValue() !== null
              ? dayjs(info.getValue()).format('DD/MM/YYYY HH:mm')
              : '-'}
          </p>
        </div>
      ),
    },
    {
      header: () => <span className="text-[14px]">{t('user.content-type-list.action')}</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => {
        return (
          <div className="flex gap-3">
            <Link to={`/result-template/${info.getValue()}`}>
              <div className="tooltip" data-tip={t('user.content-type-list.edit')}>
                <img
                  className={`cursor-pointer select-none flex items-center justify-center`}
                  src={TableEdit}
                />
              </div>
            </Link>
            <div className="tooltip" data-tip={t('user.content-type-list.delete')}>
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableDelete}
                onClick={() => {
                  onClickPageDelete(info.getValue(), info?.row?.original?.name);
                }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const onClickPageDelete = (id: number, title: string) => {
    setIdDelete(id);
    setTitleConfirm(t('user.content-type-list.are-you-sure') ?? ''); // Use translation key for title
    setMessageConfirm(t('user.content-type-list.do-you-want-to-delete', { title }) ?? ''); // Use translation key for message
    setShowConfirm(true);
  };

  // FUNCTION FOR DELETE PAGE
  const submitDeletePage = () => {
    deleteResultTemplate({ id: idDelete })
      .unwrap()
      .then(async () => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: 'Success Delete Data',
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
      <ModalConfirm
        open={showConfirm}
        cancelAction={() => {
          setShowConfirm(false);
        }}
        title={titleConfirm}
        cancelTitle={t('user.content-type-list.cancel')} // Use translation key for cancel title
        message={messageConfirm}
        submitAction={submitDeletePage}
        submitTitle={t('user.content-type-list.yes')} // Use translation key for submit title
        loading={deletePageLoading}
        icon={WarningIcon}
        btnSubmitStyle={''}
      />
      <TitleCard
        title={t('user.content-type-list.content-type-list')} // Use translation key for title
        topMargin="mt-2"
        TopSideButtons={<TopRightButton />}>
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
