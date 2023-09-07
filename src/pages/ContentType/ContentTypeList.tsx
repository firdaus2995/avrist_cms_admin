import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import {
  useDeletePageMutation,
  useDuplicatePageMutation,
} from '@/services/PageManagement/pageManagementApi';
import { useGetPostTypeListQuery } from '../../services/ContentType/contentTypeApi';
import { useTranslation } from 'react-i18next';
import { store, useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import Table from '@/components/molecules/Table';
import type { SortingState } from '@tanstack/react-table';
import TableEdit from '@/assets/table-edit.png';
import TableDelete from '@/assets/table-delete.svg';
import TableDuplicate from '@/assets/table-duplicate.svg';
import WarningIcon from '@/assets/warning.png';
import DuplicateIcon from '@/assets/duplicate.svg';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import PaginationComponent from '@/components/molecules/Pagination';
import Typography from '@/components/atoms/Typography';

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
            Add New Content Type
          </div>
        </button>
      </Link>
    </div>
  );
};

export default function ContentTypeList() {
  const roles = store.getState().loginSlice.roles;
  const contentTypeRegistrationRole = roles?.includes('CONTENT_TYPE_REGISTRATION');

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [listData, setListData] = useState<any>([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setMessageConfirm] = useState('');
  const [idDelete, setIdDelete] = useState(0);

  const [showConfirmDuplicate, setShowConfirmDuplicate] = useState(false);
  const [titleConfirmDuplicate, setTitleConfirmDuplicate] = useState('');
  const [messageConfirmDuplicate, setMessageConfirmDuplicate] = useState('');
  const [idDuplicate, setIdDuplicate] = useState(0);

  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [direction, setDirection] = useState('asc');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');

  // RTK GET DATA
  const fetchQuery = useGetPostTypeListQuery({
    pageIndex,
    limit: pageLimit,
    direction,
    search,
    sortBy,
  });
  const { data } = fetchQuery;

  // RTK DELETE
  const [deletePage, { isLoading: deletePageLoading }] = useDeletePageMutation();
  // RTK DUPLICATE
  const [duplicatePage] = useDuplicatePageMutation();

  useEffect(() => {
    if (data) {
      setListData(data?.postTypeList?.postTypeList);
      setTotal(data?.postTypeList?.total);
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
    }
  }, []);

  // TABLE COLUMN
  const COLUMNS = [
    {
      header: () => <span className="text-[14px]">Content Type Name</span>,
      accessorKey: 'name',
      enableSorting: true,
      cell: (info: any) => (
        <Link to={`${info?.row?.original?.id}`}>
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
      header: () => <span className="text-[14px]">Category</span>,
      accessorKey: 'isUseCategory',
      enableSorting: true,
      cell: (info: any) => (
        <p className="text-[14px] truncate">{info.getValue() ? 'True' : 'False'}</p>
      ),
    },
    {
      header: () => <span className="text-[14px]">{t('action.action')}</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => {
        return (
          <div className="flex gap-3">
            {contentTypeRegistrationRole && (
              <div className="tooltip" data-tip="Duplicate">
                <img
                  className={`cursor-pointer select-none flex items-center justify-center`}
                  src={TableDuplicate}
                  onClick={() => {
                    onClickPageDuplicate(info.getValue(), info?.row?.original?.name);
                  }}
                />
              </div>
            )}
            <Link to={`edit/${info.getValue()}`}>
              <div className="tooltip" data-tip={t('action.edit')}>
                <img
                  className={`cursor-pointer select-none flex items-center justify-center`}
                  src={TableEdit}
                />
              </div>
            </Link>
            <div className="tooltip" data-tip={t('action.delete')}>
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
    setTitleConfirm('Are you sure?');
    setMessageConfirm(`Do you want to delete ${title}?`);
    setShowConfirm(true);
  };

  const onClickPageDuplicate = (id: number, title: string) => {
    setIdDuplicate(id);
    setTitleConfirmDuplicate('Are you sure?');
    setMessageConfirmDuplicate(`Do you want to duplicate ${title}?`);
    setShowConfirmDuplicate(true);
  };

  // FUNCTION FOR DELETE PAGE
  const submitDeletePage = () => {
    deletePage({ id: idDelete })
      .unwrap()
      .then(async d => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: 'Success Delete Page',
            message: d.pageDelete.message,
          }),
        );
        await fetchQuery.refetch();
      })
      .catch(() => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed Delete Page',
            message: 'Something went wrong!',
          }),
        );
      });
  };

  // FUNCTION FOR DUPLICATE PAGE
  const submitDuplicatePage = () => {
    duplicatePage({ id: idDuplicate })
      .unwrap()
      .then(async () => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: 'Success Duplicate Page',
          }),
        );
        await fetchQuery.refetch();
      })
      .catch(() => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed Duplicate Page',
            message: 'Something went wrong!',
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
        cancelTitle="Cancel"
        message={messageConfirm}
        submitAction={submitDeletePage}
        submitTitle="Yes"
        loading={deletePageLoading}
        icon={WarningIcon}
        btnSubmitStyle={''}
      />
      <ModalConfirm
        open={showConfirmDuplicate}
        cancelAction={() => {
          setShowConfirmDuplicate(false);
        }}
        title={titleConfirmDuplicate}
        cancelTitle="No"
        message={messageConfirmDuplicate}
        submitAction={submitDuplicatePage}
        submitTitle="Yes"
        icon={DuplicateIcon}
        btnSubmitStyle={'btn-warning text-white'}
      />
      <TitleCard
        title="Content Type List"
        topMargin="mt-2"
        SearchBar={
          <InputSearch
            onBlur={(e: any) => {
              setSearch(e.target.value);
            }}
            placeholder="Search"
          />
        }
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
