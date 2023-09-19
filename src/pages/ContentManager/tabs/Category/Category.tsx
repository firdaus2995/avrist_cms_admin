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
      header: () => <span className="text-[14px] font-black">Category Name</span>,
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
      header: () => <span className="text-[14px] font-black">Category Description</span>,
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
  const [direction, setDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  // PERMISSION STATE
  const [canEdit] = useState(() => {
    return !!getCredential().roles.find((element: any) => {
      if (element === 'CONTENT_CATEGORY_EDIT') {
        return true;
      }
      return false;
    });
  });

  const [canDelete] = useState(() => {
    return !!getCredential().roles.find((element: any) => {
      if (element === 'CONTENT_CATEGORY_DELETE') {
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
    }
  }, []);

  const onClickPageDelete = (id: number, title: string) => {
    setIdDelete(id);
    setTitleConfirm('Are you sure?');
    setMessageConfirm(`Do you want to delete data ${title}?`);
    setShowConfirm(true);
  };

  // FUNCTION FOR DELETE PAGE
  const submitDeleteCategory = () => {
    deleteCategory({ id: idDelete })
      .unwrap()
      .then(async d => {
        setShowConfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: 'Success Delete Category',
            message: d.pageDelete.message,
          }),
        );
        await fetchQuery.refetch();
      })
      .catch((err) => {
        setShowConfirm(false);
        if (err.message.includes('DataIsUsedException')) {
          setShowIsUsed(true); return;
        }
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed Delete Category',
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
        cancelTitle="No"
        message={messageConfirm}
        submitAction={submitDeleteCategory}
        submitTitle="Yes"
        loading={deleteCategoryLoading}
        icon={WarningIcon}
        btnSubmitStyle={'btn-error'}
      />
      <ModalConfirm
        open={showIsUsed}
        title={''}
        message={"You can't delete this category, because this category is been used in an active page"}
        submitTitle="Ok"
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
