import React, { useCallback, useEffect, useState } from 'react';
import { SortingState } from '@tanstack/react-table';
import { t } from 'i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Plus from '@/assets/plus.png';
import Table from '@/components/molecules/Table';
import TableEdit from '../../assets/table-edit.png';
import TableView from '../../assets/table-view.png';
import TableDelete from '../../assets/table-delete.svg';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import WarningIcon from '../../assets/warning.png';
import PaginationComponent from '@/components/molecules/Pagination';
import PreviewModal from './PreviewModal';
import RoleRenderer from '../../components/atoms/RoleRenderer';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { useAppDispatch } from '@/store';
import {
  useGetEmailFormBuilderQuery,
  useDeleteEmailFormBuilderMutation,
  useGetEmailBodyQuery,
  useDeleteEmailBodyMutation,
} from '@/services/EmailFormBuilder/emailFormBuilderApi';
import { openToast } from '@/components/atoms/Toast/slice';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

export default function EmailFormBuilderList() {
  // TABLE COLUMN
  const columnsEFB = [
    {
      header: () => (
        <span className="text-[14px]">
          {t('user.email-form-builder-list.email-form-builder.list.form-name')}
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
          {t('user.email-form-builder-list.email-form-builder.list.action')}
        </span>
      ),
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
          <RoleRenderer allowedRoles={['EMAIL_FORM_EDIT']}>
            <Link to={`edit/${info.getValue()}`}>
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableEdit}
              />
            </Link>
          </RoleRenderer>
          <RoleRenderer allowedRoles={['EMAIL_FORM_DELETE']}>
            <img
              className={`cursor-pointer select-none flex items-center justify-center`}
              src={TableDelete}
              onClick={() => {
                onClickEmailFormBuilderDelete(info.getValue());
              }}
            />
          </RoleRenderer>
        </div>
      ),
    },
  ];

  const columnsEB = [
    {
      header: () => (
        <span className="text-[14px]">
          {t('user.email-form-builder-list.email-body.list.title')}
        </span>
      ),
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
      header: () => (
        <span className="text-[14px]">
          {t('user.email-form-builder-list.email-body.list.short-description')}
        </span>
      ),
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
      header: () => (
        <span className="text-[14px]">
          {t('user.email-form-builder-list.email-body.list.action')}
        </span>
      ),
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-3">
          <RoleRenderer allowedRoles={['EMAIL_FORM_READ']}>
            <Link
              to={`view-body/${info.getValue()}`}
              className="min-h-[34px] h-[34px] btn btn-outline btn-primary text-xs"
            >
              {t('user.email-form-builder-list.email-body.list.view-detail')}
            </Link>
          </RoleRenderer>
          <RoleRenderer allowedRoles={['EMAIL_FORM_DELETE']}>
            <img
              className={`cursor-pointer select-none flex items-center justify-center`}
              src={TableDelete}
              onClick={() => {
                onClickEmailBodyDelete(info.getValue());
              }}
            />
          </RoleRenderer>
        </div>
      ),
    },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [listDataEFB, setListDataEFB] = useState([]);
  const [listDataEB, setListDataEB] = useState([]);
  const [searchEFB, setSearchEFB] = useState('');
  const [tempSearchEFB, setTempSearchEFB] = useState('');
  const [searchEB, setSearchEB] = useState('');
  const [tempSearchEB, setTempSearchEB] = useState('');

  // TAB STATE
  const [selectedTab, setSelectedTab] = useState(location?.state?.from === 'EMAIL_BODY' ? 1 : 0);

  const [totalEFB, setTotalEFB] = useState(0);
  const [pageIndexEFB, setPageIndexEFB] = useState(0);
  const [pageLimitEFB, setPageLimitEFB] = useState(10);
  const [directionEFB, setDirectionEFB] = useState('desc');
  const [sortByEFB, setSortByEFB] = useState('id');
  const [totalEB, setTotalEB] = useState(0);
  const [pageIndexEB, setPageIndexEB] = useState(0);
  const [pageLimitEB, setPageLimitEB] = useState(10);
  const [directionEB, setDirectionEB] = useState('desc');
  const [sortByEB, setSortByEB] = useState('id');

  const [openDeleteModalEFB, setOpenDeleteModalEFB] = useState(false);
  const [deleteModalTitleEFB, setDeleteModalTitleEFB] = useState('');
  const [deleteModalBodyEFB, setDeleteModalBodyEFB] = useState('');
  const [deletedIdEFB, setDeletedIdEFB] = useState(0);
  const [openDeleteModalEB, setOpenDeleteModalEB] = useState(false);
  const [deleteModalTitleEB, setDeleteModalTitleEB] = useState('');
  const [deleteModalBodyEB, setDeleteModalBodyEB] = useState('');
  const [deletedIdEB, setDeletedIdEB] = useState(0);

  const [previewIdEFB, setPreviewIdEFB] = useState(null);

  // RTK GET DATA EFB
  const fetchQueryEFB = useGetEmailFormBuilderQuery(
    {
      pageIndex: pageIndexEFB,
      limit: pageLimitEFB,
      sortBy: sortByEFB,
      direction: directionEFB,
      search: searchEFB,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: dataEFB, isFetching: isFetchingEFB, isError: isErrorEFB } = fetchQueryEFB;

  // RTK GET DATA EB
  const fetchQueryEB = useGetEmailBodyQuery(
    {
      pageIndex: pageIndexEB,
      limit: pageLimitEB,
      sortBy: sortByEB,
      direction: directionEB,
      search: searchEB,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: dataEB, isFetching: isFetchingEB, isError: isErrorEB } = fetchQueryEB;

  // RTK DELETE
  const [deleteEmailFormBuilder, { isLoading: deleteEmailFormBuilderLoading }] =
    useDeleteEmailFormBuilderMutation();
  const [deleteEmailBody, { isLoading: deleteEmailBodyLoading }] = useDeleteEmailBodyMutation();

  useEffect(() => {
    if (selectedTab === 0) {
      void fetchQueryEFB.refetch();
    } else if (selectedTab === 1) {
      void fetchQueryEB.refetch();
    }
  }, [selectedTab]);

  useEffect(() => {
    if (dataEFB) {
      setListDataEFB(dataEFB?.postTypeList?.postTypeList);
      setTotalEFB(dataEFB?.postTypeList?.total);
    }
  }, [dataEFB]);

  useEffect(() => {
    if (dataEB) {
      setListDataEB(dataEB?.emailBodyList?.emailBodies);
      setTotalEB(dataEB?.emailBodyList?.total);
    }
  }, [dataEB]);

  useEffect(() => {
    if (selectedTab === 0) {
      void fetchQueryEFB.refetch();
      clearSearchValue();
    } else if (selectedTab === 1) {
      void fetchQueryEB.refetch();
      clearSearchValue();
    }
  }, [selectedTab]);

  // FUNCTION FOR CLEARING SEARCH VALUE
  function clearSearchValue() {
    setSearchEB('');
    setSearchEFB('');
    setTempSearchEFB('');
    setTempSearchEB('');
  }

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChangeEFB = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortByEFB(sortModel[0].id);
      setDirectionEFB(sortModel[0].desc ? 'desc' : 'asc');
    }else{
      setSortByEFB('id');
      setDirectionEFB('desc');
    }
  }, []);

  const handleSortModelChangeEB = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortByEB(sortModel[0].id);
      setDirectionEB(sortModel[0].desc ? 'desc' : 'asc');
    }else{
      setSortByEB('id');
      setDirectionEB('desc');
    }
  }, []);

  // FUNCTION FOR DELETE PAGE TEMPLATE
  const submitDeleteEmailFormBuilder = () => {
    deleteEmailFormBuilder({ id: deletedIdEFB })
      .unwrap()
      .then(async d => {
        setOpenDeleteModalEFB(false);
        dispatch(
          openToast({
            type: 'success',
            title: t(
              'user.email-form-builder-list.email-form-builder.list.success-delete-email-form',
            ),
            message: d.postTypeDelete.message,
          }),
        );
        if (listDataEFB?.length === 1) {
          setPageIndexEFB(pageIndexEFB - 1);
        }
        await fetchQueryEFB.refetch();
      })
      .catch((error: any) => {
        setOpenDeleteModalEFB(false);
        dispatch(
          openToast({
            type: 'error',
            title: t(
              'user.email-form-builder-list.email-form-builder.list.failed-delete-email-form',
            ),
            message: t(`errors.email-form-builder.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  const submitDeleteEmailBody = () => {
    deleteEmailBody({ id: deletedIdEB })
      .unwrap()
      .then(async d => {
        dispatch(
          openToast({
            type: 'success',
            title: t('user.email-form-builder-list.email-body.list.success-delete-email-body'),
            message: d.message,
          }),
        );
        if (listDataEB?.length === 1) {
          setPageIndexEB(pageIndexEB - 1);
        }
        await fetchQueryEB.refetch();
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.email-form-builder-list.email-body.list.failed-delete-email-body'),
            message: t(`errors.email-form-builder.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  // TABLE FUNCTION FOR VIEW EMAIL FORM BUILDER
  const onClickEmailFormBuilderView = (id: any) => {
    setPreviewIdEFB(id);
  };

  // TABLE FUNCTION FOR DELETE EMAIL FORM BUILDER
  const onClickEmailFormBuilderDelete = (id: number) => {
    setDeletedIdEFB(id);
    setDeleteModalTitleEFB(`Are you sure?`);
    setDeleteModalBodyEFB(`Do you want to delete this form?`);
    setOpenDeleteModalEFB(true);
  };

  const onClickEmailBodyDelete = (id: number) => {
    setDeletedIdEB(id);
    setDeleteModalTitleEB(`Are you sure?`);
    setDeleteModalBodyEB(`Do you want to delete this email body?`);
    setOpenDeleteModalEB(true);
  };

  // TAB RENDER

  const renderTabs = () => {
    return (
      <div className="btn-group mb-4">
        <div
          className={`btn bg-[#EEF1F7] text-[#ABB5C4] border-0 ${
            selectedTab === 0 ? '!bg-lavender !text-white' : ''
          } hover:!bg-primary hover:text-white`}
          onClick={() => {
            setSelectedTab(0);
            navigate('', {
              state: {
                from: '',
              },
            });
          }}>
          {t('user.email-form-builder-list.email-form-builder.list.email-form-builder')}
        </div>
        <div
          className={`btn bg-[#EEF1F7] text-[#ABB5C4] border-0 ${
            selectedTab === 1 ? '!bg-lavender !text-white' : ''
          } hover:!bg-primary hover:text-white`}
          onClick={() => {
            setSelectedTab(1);
            navigate('', {
              state: {
                from: 'EMAIL_BODY',
              },
            });
          }}>
          {t('user.email-form-builder-list.email-body.list.email-body')}
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <RoleRenderer allowedRoles={['EMAIL_FORM_READ']}>
        <PreviewModal
          id={previewIdEFB}
          open={!!previewIdEFB}
          toggle={() => {
            setPreviewIdEFB(null);
          }}
        />
        <ModalConfirm
          open={openDeleteModalEFB}
          title={deleteModalTitleEFB}
          message={deleteModalBodyEFB}
          cancelTitle={t('user.email-form-builder-list.email-form-builder.list.cancel-title')}
          submitTitle={t('user.email-form-builder-list.email-form-builder.list.submit-title')}
          submitAction={submitDeleteEmailFormBuilder}
          cancelAction={() => {
            setOpenDeleteModalEFB(false);
          }}
          loading={deleteEmailFormBuilderLoading}
          icon={WarningIcon}
          btnSubmitStyle=""
        />
        <ModalConfirm
          open={openDeleteModalEB}
          title={deleteModalTitleEB}
          message={deleteModalBodyEB}
          cancelTitle={t('user.email-form-builder-list.email-body.list.cancel-title')}
          submitTitle={t('user.email-form-builder-list.email-body.list.submit-title')}
          submitAction={() => {
            submitDeleteEmailBody(); 
            setOpenDeleteModalEB(false);
          }}
          cancelAction={() => {
            setOpenDeleteModalEB(false);
          }}
          loading={deleteEmailBodyLoading}
          icon={WarningIcon}
          btnSubmitStyle="btn-error"
        />
        <TitleCard
          title={
            selectedTab === 0
              ? t('user.email-form-builder-list.email-form-builder.list.title-card')
              : t('user.email-form-builder-list.email-body.list.title-card')
          }
          topMargin="mt-2"
          TopSideButtons={
            <RoleRenderer allowedRoles={['EMAIL_FORM_CREATE']}>
              {
                selectedTab === 0 ? (
                  <Link to="new" className="btn btn-primary flex flex-row gap-2 rounded-xl">
                    <img src={Plus} className="w-[24px] h-[24px]" />
                    <span>
                      {t('user.email-form-builder-list.email-form-builder.list.add-new-form')}
                    </span>
                  </Link>
                ) : (
                  <Link to="new-body" className="btn btn-primary flex flex-row gap-2 rounded-xl">
                    <img src={Plus} className="w-[24px] h-[24px]" />
                    <span>{t('user.email-form-builder-list.email-body.list.add-new-form')}</span>
                  </Link>
                )
              }
            </RoleRenderer>
          }
          SearchBar={
            selectedTab === 0 ? (
              <InputSearch
                value={tempSearchEFB}
                onBlur={(e: any) => {
                  setSearchEFB(e.target.value);
                }}
                onChange={(e) => {
                  setTempSearchEFB(e.target.value);
                }}
                placeholder={t('user.email-form-builder-list.email-form-builder.list.search') ?? ''}
              />
            ) : (
              <InputSearch
                value={tempSearchEB}
                onBlur={(e: any) => {
                  setSearchEB(e.target.value);
                }}
                onChange={(e) => {
                  setTempSearchEB(e.target.value);
                }}
                placeholder={t('user.email-form-builder-list.email-body.list.search') ?? ''}
              />
            )
          }>
          {renderTabs()}
          {selectedTab === 0 ? (
            <>
              <Table
                rows={listDataEFB}
                columns={columnsEFB}
                manualPagination={true}
                manualSorting={true}
                onSortModelChange={handleSortModelChangeEFB}
                loading={isFetchingEFB}
                error={isErrorEFB}
              />
              <PaginationComponent
                total={totalEFB}
                page={pageIndexEFB}
                pageSize={pageLimitEFB}
                setPageSize={(page: number) => {
                  setPageLimitEFB(page);
                  setPageIndexEFB(0);
                }}
                setPage={(page: number) => {
                  setPageIndexEFB(page);
                }}
              />
            </>
          ) : (
            <>
              <Table
                rows={listDataEB}
                columns={columnsEB}
                manualPagination={true}
                manualSorting={true}
                onSortModelChange={handleSortModelChangeEB}
                loading={isFetchingEB}
                error={isErrorEB}
              />
              <PaginationComponent
                total={totalEB}
                page={pageIndexEB}
                pageSize={pageLimitEB}
                setPageSize={(page: number) => {
                  setPageLimitEB(page);
                  setPageIndexEB(0);
                }}
                setPage={(page: number) => {
                  setPageIndexEB(page);
                }}
              />
            </>
          )}
        </TitleCard>
      </RoleRenderer>
    </React.Fragment>
  );
}
