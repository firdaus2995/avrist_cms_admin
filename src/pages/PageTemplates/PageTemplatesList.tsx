import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import { Link } from 'react-router-dom';
import { SortingState } from '@tanstack/table-core';

import Table from '../../components/molecules/Table';
import TableDelete from '../../assets/table-delete.svg';
import PaginationComponent from '../../components/molecules/Pagination';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import WarningIcon from '../../assets/warning.png';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { InputSearch } from '../../components/atoms/Input/InputSearch';
import {
  useDeletePageTemplateMutation,
  useGetPageTemplateQuery,
} from '../../services/PageTemplate/pageTemplateApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import RoleRenderer from '../../components/atoms/RoleRenderer';

export default function PageTemplatesList() {
  const { t } = useTranslation(); // Initialize the useTranslation hook

  const columns = [
    {
      header: () => (
        <span className="text-[14px]">
          {t('user.page-template-list.page-template.table.page-id')}
        </span>
      ),
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
      header: () => (
        <span className="text-[14px]">
          {t('user.page-template-list.page-template.table.page-name')}
        </span>
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
        <span className="text-[14px]">
          {t('user.page-template-list.page-template.table.uploaded-by')}
        </span>
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
        <span className="text-[14px]">
          {t('user.page-template-list.page-template.table.action')}
        </span>
      ),
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-3">
          <Link to={`detail/${info.getValue()}`}>
            <button
              className='min-h-[34px] h-[34px] btn btn-outline btn-primary text-xs'
            >
              {t('user.page-template-list.page-template.table.view-detail')}
            </button>
          </Link>
          <RoleRenderer allowedRoles={['PAGE_TEMPLATE_DELETE']}>
            <div className="tooltip" data-tip="Delete">
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableDelete}
                onClick={() => {
                  onClickPageTemplateDelete(info.getValue());
                }}
              />
            </div>
          </RoleRenderer>
        </div>
      ),
    },
  ];

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

  const fetchQuery = useGetPageTemplateQuery(
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

  const [deletedPageTemplate, { isLoading: isLoadingDelete }] = useDeletePageTemplateMutation();

  useEffect(() => {
    if (data) {
      setListData(data?.pageTemplateList?.templates);
      setTotal(data?.pageTemplateList?.total);
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
  const submitDeleteUser = () => {
    deletedPageTemplate({
      id: deletedId,
    })
      .unwrap()
      .then(async (result: any) => {
        setOpenDeleteModal(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.page-template-list.toasts.success-delete'),
            message: result.pageTemplateDelete.message,
          }),
        );
        await fetchQuery.refetch();
        setPageIndex(0);
      })
      .catch(() => {
        setOpenDeleteModal(false);
        dispatch(
          openToast({
            type: 'error',
            title: t('user.page-template-list.toasts.error-delete'),
            message: t('user.page-template-list.toasts.error-message'),
          }),
        );
      });
  };

  const onClickPageTemplateDelete = (id: number) => {
    setDeletedId(id);
    setDeleteModalTitle(
      t('user.page-template-list.page-template.table.delete-confirm-title') ?? '',
    );
    setDeleteModalBody(t('user.page-template-list.page-template.table.delete-confirm-body') ?? '');
    setOpenDeleteModal(true);
  };

  return (
    <React.Fragment>
      <RoleRenderer allowedRoles={['PAGE_TEMPLATE_READ']}>
        <ModalConfirm
          open={openDeleteModal}
          title={deleteModalTitle}
          message={deleteModalBody}
          cancelTitle={t('user.page-template-list.buttons.cancel')}
          submitTitle={t('user.page-template-list.buttons.yes')}
          submitAction={submitDeleteUser}
          cancelAction={() => {
            setOpenDeleteModal(false);
          }}
          loading={isLoadingDelete}
          icon={WarningIcon}
          btnSubmitStyle=""
        />
        {/* <ModalForm
        open={openEditModal}
        loading={isLoadingEdit}
        formTitle="Page Template"
        submitTitle={t('user.page-template-list.btn.save-alternate')}
        cancelTitle={t('user.page-template-list.btn.cancel')}
        cancelAction={() => {
          setOpenEditModal(false);
        }}
        submitAction={submitEditUser}
        submitType={''}>
        <InputText
          labelTitle="Page Name"
          labelStyle="font-bold	"
          labelRequired
          value={editPageName}
          direction="row"
          themeColor="lavender"
          roundStyle="xl"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEditPageName(event.target.value);
          }}
        />
        <InputText
          labelTitle="Page Description"
          labelStyle="font-bold	"
          labelRequired
          value={editPageDescription}
          direction="row"
          themeColor="lavender"
          roundStyle="xl"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEditPageDescription(event.target.value);
          }}
        />
        <InputText
          labelTitle="Page File name"
          labelStyle="font-bold	"
          labelRequired
          value={editPageFileName}
          direction="row"
          themeColor="lavender"
          roundStyle="xl"
          disabled
        />
      </ModalForm> */}
        <TitleCard
          title={t('user.page-template-list.page-template.list.title')}
          topMargin="mt-2"
          TopSideButtons={
            <Link to="new" className="btn btn-primary flex flex-row gap-2 rounded-xl">
              {t('user.page-template-list.page-template.list.button-add')}
            </Link>
          }
          SearchBar={
            <InputSearch
              onBlur={(e: any) => {
                setSearch(e.target.value);
              }}
              placeholder={t('user.page-template-list.page-template.search-placeholder') ?? ''}
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
    </React.Fragment>
  );
}
