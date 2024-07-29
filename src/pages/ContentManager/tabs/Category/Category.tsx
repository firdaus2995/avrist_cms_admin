import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Table from '@/components/molecules/Table';
import PaginationComponent from '@/components/molecules/Pagination';
import TableEdit from '@/assets/table-edit.png';
import {
  useDeleteCategoryMutation,
  useGetCategoryListQuery,
} from '@/services/ContentManager/contentManagerApi';
import { SortingState } from '@tanstack/react-table';
import { getCredential } from '@/utils/Credential';
import TableDelete from '@/assets/table-delete.svg';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import WarningIcon from '@/assets/warning.png';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';

export default function CategoryTab(_props: { id: any }) {
  const COLUMNS = [
    {
      header: () => (
        <span className="text-[14px] font-black">{t('user.tabs-category.categoryName')}</span>
      ),
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
      header: () => (
        <span className="text-[14px] font-black">
          {t('user.tabs-category.categoryDescription')}
        </span>
      ),
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
      header: () => <span className="text-[14px] font-black">{t('action.action')}</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (_info: any) => (
        <div className="flex gap-3">
          {canEdit && (
            <Link to={`category/edit/${_info.getValue()}`}>
              <div className="tooltip" data-tip={t('action.edit')}>
                <img
                  className={`cursor-pointer select-none flex items-center justify-center`}
                  src={TableEdit}
                />
              </div>
            </Link>
          )}
          {canDelete && (
            <div className="tooltip" data-tip={t('action.delete')}>
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableDelete}
                onClick={() => {
                  onClickPageDelete(_info.getValue(), _info?.row?.original?.name);
                }}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [listData, setListData] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showIsUsed, setShowIsUsed] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setMessageConfirm] = useState('');
  const [idDelete, setIdDelete] = useState(0);
  const [deleteCategory, { isLoading: deleteCategoryLoading }] = useDeleteCategoryMutation();

  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [direction, setDirection] = useState('desc');
  const [sortBy, setSortBy] = useState('id');
  // PERMISSION STATE
  const [canEdit] = useState(() => {
    return !!getCredential().roles.find((element: any) => {
      if (element === 'CONTENT_MANAGER_EDIT') {
        return true;
      }
      return false;
    });
  });

  const [canDelete] = useState(() => {
    return !!getCredential().roles.find((element: any) => {
      if (element === 'CONTENT_MANAGER_DELETE') {
        return true;
      }
      return false;
    });
  });

  // RTK GET DATA
  const fetchQuery = useGetCategoryListQuery(
    {
      postTypeId: _props.id,
      pageIndex,
      limit: pageLimit,
      sortBy,
      direction,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data, isFetching, isError } = fetchQuery;

  useEffect(() => {
    if (data) {
      setListData(data?.categoryList?.categoryList);
      setTotal(data?.categoryList?.total);
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

  const onClickPageDelete = (id: number, title: string) => {
    setIdDelete(id);
    setTitleConfirm(t('user.tabs-category.confirm.title') ?? '');
    setMessageConfirm(t('user.tabs-category.confirm.message', { title }) ?? '');
    setShowConfirm(true);
  };

  // FUNCTION FOR DELETE PAGE
  const submitDeleteCategory = () => {
    if (!idDelete) {
      console.error('idDelete is not defined');
      return;
    }

    deleteCategory({ id: idDelete })
      .unwrap()
      .then(async _d => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.tabs-category.toast.successDelete'),
            message: t('user.tabs-category.toast.successDeleteCategory'),
          }),
        );
        setTimeout(() => {
          window.location.reload();
        }, 100);
        if (listData?.length === 1) {
          setPageIndex(0);
        }
        try {
          await fetchQuery.refetch();
        } catch (refetchError) {
          console.error('Failed to refetch data', refetchError);
        }
      })
      .catch(err => {
        console.error('Failed to delete category', err);
        setShowConfirm(false);
        if (err.message.includes('DataIsUsedException')) {
          setShowIsUsed(true);
          return;
        }
        dispatch(
          openToast({
            type: 'error',
            title: t('user.tabs-category.toast.failedDelete'),
            message: t('user.tabs-category.toast.somethingWrong'),
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
        cancelTitle={t('user.tabs-category.confirm.no')}
        message={messageConfirm}
        submitAction={submitDeleteCategory}
        submitTitle={t('user.tabs-category.confirm.yes')}
        loading={deleteCategoryLoading}
        icon={WarningIcon}
        btnSubmitStyle={'btn-error'}
      />
      <ModalConfirm
        open={showIsUsed}
        title={''}
        message={t('user.tabs-category.modal.cantDelete') ?? ''}
        submitTitle={t('user.tabs-category.modal.ok')}
        icon={WarningIcon}
        submitAction={() => {
          setShowIsUsed(false);
        }}
        btnSubmitStyle="btn-error"
        cancelTitle={''}
        cancelAction={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      <div className="overflow-x-auto w-full mb-5">
        <Table
          rows={listData}
          columns={COLUMNS}
          loading={isFetching}
          error={isError}
          onSortModelChange={handleSortModelChange}
          manualPagination={true}
          manualSorting={true}
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
