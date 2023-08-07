import React, { useCallback, useEffect, useState } from 'react';
import { SortingState } from '@tanstack/react-table';
import { t } from 'i18next';
import { Link, useNavigate } from 'react-router-dom';

import Plus from '@/assets/plus.png';
import Table from '@/components/molecules/Table';
import TableEdit from '../../assets/table-edit.png';
import TableView from '../../assets/table-view.png';
import TableDelete from '../../assets/table-delete.svg';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import WarningIcon from '../../assets/warning.png';
import PaginationComponent from '@/components/molecules/Pagination';
import CopyLink from '../../assets/copylink.svg';
import PreviewModal from './PreviewModal';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { useAppDispatch } from '@/store';
import {
  useGetEmailFormBuilderQuery,
  useDeleteEmailFormBuilderMutation,
} from '@/services/EmailFormBuilder/emailFormBuilderApi';
import { openToast } from '@/components/atoms/Toast/slice';

export default function EmailFormBuilderList() {
  // TABLE COLUMN
  const columns = [
    {
      header: () => <span className="text-[14px]">Form Name</span>,
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
      header: () => <span className="text-[14px]">Link</span>,
      accessorKey: 'slug',
      enableSorting: true,
      cell: (info: any) => {
        return (
          <div className="flex gap-3">
            <p className="text-[14px] truncate">
              {info.getValue() && info.getValue() !== '' && info.getValue() !== null
                ? info.getValue()
                : '-'}
            </p>
            <img
              className="cursor-pointer"
              src={CopyLink}
              onClick={() => {
                void navigator.clipboard.writeText(info.getValue());
              }}
            />
          </div>
        );
      },
    },
    {
      header: () => <span className="text-[14px]">Action</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-3">
          <button>
            <img
              className={`cursor-pointer select-none flex items-center justify-center`}
              src={TableView}
              onClick={() => {
                onClickEmailFormBuilderView(info.getValue());
              }}
            />
          </button>
          <button>
            <img
              className={`cursor-pointer select-none flex items-center justify-center`}
              src={TableEdit}
              onClick={() => {
                onClickEmailFormBuilderEdit(info.getValue());
              }}
            />
          </button>
          <img
            className={`cursor-pointer select-none flex items-center justify-center`}
            src={TableDelete}
            onClick={() => {
              onClickEmailFormBuilderDelete(info.getValue());
            }}
          />
        </div>
      ),
    },
  ];

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [listData, setListData] = useState([]);
  const [search, setSearch] = useState('');
  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [direction, setDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  // DELETE MODAL STATE
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteModalTitle, setDeleteModalTitle] = useState('');
  const [deleteModalBody, setDeleteModalBody] = useState('');
  const [deletedId, setDeletedId] = useState(0);
  // PREVIEW MODAL
  const [previewId, setPreviewId] = useState(null);

  // RTK GET DATA
  const fetchQuery = useGetEmailFormBuilderQuery(
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
  const [deletePostType, { isLoading: deletePostTypeLoading }] = useDeleteEmailFormBuilderMutation();

  useEffect(() => {
    if (data) {
      setListData(data?.postTypeList?.postTypeList);
      setTotal(data?.postTypeList?.total);
    }
  }, [data]);

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    }
  }, []);

  // FUNCTION FOR DELETE PAGE TEMPLATE
  const submitDeleteEmailFormBuilder = () => {
    deletePostType({ id: deletedId })
      .unwrap()
      .then(async d => {
        setOpenDeleteModal(false);
        dispatch(
          openToast({
            type: 'success',
            title: 'Success Delete Email Form',
            message: d.pageDelete.message,
          }),
        );
        await fetchQuery.refetch();
      })
      .catch(() => {
        setOpenDeleteModal(false);
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed Delete Email Form',
            message: 'Something went wrong!',
          }),
        );
      });
  };

  // TABLE FUNCTION FOR VIEW EMAIL FORM BUILDER
  const onClickEmailFormBuilderView = (id: any) => {
    setPreviewId(id);
  };

  // TABLE FUNCTION FOR EDIT EMAIL FORM BUILDER
  const onClickEmailFormBuilderEdit = (id: number) => {
    navigate(`edit/${id}`);
  };

  // TABLE FUNCTION FOR DELETE EMAIL FORM BUILDER
  const onClickEmailFormBuilderDelete = (id: number) => {
    setDeletedId(id);
    setDeleteModalTitle(`Are you sure?`);
    setDeleteModalBody(`Do you want to delete this form?`);
    setOpenDeleteModal(true);
  };

  // DELETE THIS AFTER INTEGRATION
  useEffect(() => {
    console.log(dispatch, setListData, search, setTotal, direction, sortBy);
  }, []);

  return (
    <React.Fragment>
      <PreviewModal
        id={previewId}
        open={!!previewId}
        toggle={() => {
          setPreviewId(null);
        }}
      />
      <ModalConfirm
        open={openDeleteModal}
        title={deleteModalTitle}
        message={deleteModalBody}
        cancelTitle="Cancel"
        submitTitle="Yes"
        submitAction={submitDeleteEmailFormBuilder}
        cancelAction={() => {
          setOpenDeleteModal(false);
        }}
        loading={deletePostTypeLoading}
        icon={WarningIcon}
        btnSubmitStyle=""
      />
      <TitleCard
        title={t('email-form-builder.list.title')}
        topMargin="mt-2"
        TopSideButtons={
          <Link to="new" className="btn btn-primary flex flex-row gap-2 rounded-xl">
            <img src={Plus} className="w-[24px] h-[24px]" />
            {t('email-form-builder.list.button-add')}
          </Link>
        }
        SearchBar={
          <InputSearch
            onBlur={(e: any) => {
              setSearch(e.target.value);
            }}
            placeholder="Search"
          />
        }>
        <Table
          rows={listData}
          columns={columns}
          manualPagination={true}
          manualSorting={true}
          onSortModelChange={handleSortModelChange}
          loading={isFetching}
          error={isError}
        />
        <PaginationComponent
          total={total}
          page={pageIndex}
          pageSize={pageLimit}
          rangePageSize={[10, 20, 30]}
          setPageSize={(page: number) => {
            setPageLimit(page);
            setPageIndex(0);
          }}
          setPage={(page: number) => {
            setPageIndex(page);
          }}
        />
      </TitleCard>
    </React.Fragment>
  );
}
