import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { useDuplicatePageMutation } from '@/services/PageManagement/pageManagementApi';
import {
  useGetPostTypeListQuery,
  useDeleteContentTypeMutation,
} from '../../services/ContentType/contentTypeApi';
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
import { t } from 'i18next';
import RoleRenderer from '../../components/atoms/RoleRenderer';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

const TopRightButton = () => {
  return (
    <div className="flex flex-row">
      <RoleRenderer allowedRoles={['CONTENT_TYPE_CREATE']}>
        <CreateButton />
      </RoleRenderer>
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
            {t('user.content-type-list.add-new-content-type')}
          </div>
        </button>
      </Link>
    </div>
  );
};

export default function ContentTypeList() {
  const roles = store.getState().loginSlice.roles;
  const contentTypeRegistrationRole = roles?.includes('CONTENT_TYPE_CREATE');

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
  const [direction, setDirection] = useState('desc');
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
  const [deleteContentType, { isLoading: deletePageLoading }] = useDeleteContentTypeMutation();
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
    }else{
      setSortBy('id');
      setDirection('desc');
    }
  }, []);

  // TABLE COLUMN
  const COLUMNS = [
    {
      header: () => (
        <span className="text-[14px]">{t('user.content-type-list.content-type-name')}</span>
      ), // Use translation key for header
      accessorKey: 'name',
      enableSorting: true,
      cell: (info: any) => (
        <Link to={`${info?.row?.original?.id}`}>
          <div className="flex justify-center items-center w-96">
            <Typography
              type="body"
              size="s"
              weight="semi"
              className="truncate cursor-pointer text-primary">
              {info.getValue() && info.getValue() !== '' && info.getValue() !== null
                ? info.getValue()
                : '-'}
            </Typography>
          </div>
        </Link>
      ),
    },
    {
      header: () => <span className="text-[14px]">{t('user.content-type-list.category')}</span>, // Use translation key for header
      accessorKey: 'isUseCategory',
      enableSorting: true,
      cell: (info: any) => (
        <p className="text-[14px] truncate">{info.getValue() ? 'True' : 'False'}</p>
      ),
    },
    {
      header: () => <span className="text-[14px]">{t('user.content-type-list.action')}</span>, // Use translation key for header
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
            <RoleRenderer allowedRoles={['CONTENT_TYPE_EDIT']}>
              <Link to={`edit/${info.getValue()}`}>
                <div className="tooltip" data-tip={t('user.content-type-list.edit')}>
                  <img
                    className={`cursor-pointer select-none flex items-center justify-center`}
                    src={TableEdit}
                  />
                </div>
              </Link>
            </RoleRenderer>
            <RoleRenderer allowedRoles={['CONTENT_TYPE_DELETE']}>
              <div className="tooltip" data-tip={t('user.content-type-list.delete')}>
                <img
                  className={`cursor-pointer select-none flex items-center justify-center`}
                  src={TableDelete}
                  onClick={() => {
                    onClickPageDelete(info.getValue(), info?.row?.original?.name);
                  }}
                />
              </div>
            </RoleRenderer>
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

  const onClickPageDuplicate = (id: number, title: string) => {
    setIdDuplicate(id);
    setTitleConfirmDuplicate(t('user.content-type-list.are-you-sure') ?? ''); // Use translation key for title
    setMessageConfirmDuplicate(
      t('user.content-type-list.do-you-want-to-duplicate', { title }) ?? '',
    ); // Use translation key for message
    setShowConfirmDuplicate(true);
  };

  // FUNCTION FOR DELETE PAGE
  const submitDeletePage = () => {
    deleteContentType({ id: idDelete })
      .unwrap()
      .then(async d => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.content-type-list.success-delete-content-type'),
            message: d.postTypeDelete.message,
          }),
        );
        await fetchQuery.refetch();
      })
      .catch((error: any) => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'error',
            title: t('user.content-type-list.failed-delete-content-type'),
            message: t(`errors.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  // FUNCTION FOR DUPLICATE PAGE
  const submitDuplicatePage = () => {
    duplicatePage({ id: idDuplicate })
      .unwrap()
      .then(async () => {
        setShowConfirmDuplicate(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.content-type-list.success-duplicate-page'), // Use translation key for success title
          }),
        );
        await fetchQuery.refetch();
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.content-type-list.failed-duplicate-page'), // Use translation key for error title
            message: t('user.content-type-list.something-went-wrong'), // Use translation key for error message
          }),
        );
      });
  };

  return (
    <>
      <RoleRenderer allowedRoles={['CONTENT_TYPE_READ']}>
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
        <ModalConfirm
          open={showConfirmDuplicate}
          cancelAction={() => {
            setShowConfirmDuplicate(false);
          }}
          title={titleConfirmDuplicate}
          cancelTitle={t('user.content-type-list.no')} // Use translation key for cancel title
          message={messageConfirmDuplicate}
          submitAction={submitDuplicatePage}
          submitTitle={t('user.content-type-list.yes')} // Use translation key for submit title
          icon={DuplicateIcon}
          btnSubmitStyle={'btn-warning text-white'}
        />
        <TitleCard
          title={t('user.content-type-list.content-type-list')} // Use translation key for title
          topMargin="mt-2"
          SearchBar={
            <InputSearch
              onBlur={(e: any) => {
                setSearch(e.target.value);
              }}
              placeholder={t('user.content-type-list.search') ?? ''} // Use translation key for placeholder
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
      </RoleRenderer>
    </>
  );
}
