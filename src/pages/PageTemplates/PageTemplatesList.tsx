import React, { 
  useCallback, 
  useEffect, 
  useState,
} from "react";
import { 
  t,
} from "i18next";
import { 
  Link,
} from "react-router-dom";
import { 
  SortingState,
} from "@tanstack/table-core";

import Table from "../../components/molecules/Table";
import TableEdit from "../../assets/table-edit.png";
import TableView from "../../assets/table-view.png";
import TableDelete from "../../assets/table-delete.png";
import PaginationComponent from "../../components/molecules/Pagination";
import ModalConfirm from "../../components/molecules/ModalConfirm";
import WarningIcon from "../../assets/warning.png";
import ModalForm from "../../components/molecules/ModalForm";
import { 
  TitleCard,
} from "../../components/molecules/Cards/TitleCard";
import { 
  InputSearch,
} from "../../components/atoms/Input/InputSearch";
import { 
  useDeletePageTemplateMutation, 
  useEditPageTemplateMutation, 
  useGetPageTemplateQuery,
} from "../../services/PageTemplate/pageTemplateApi";
import { 
  useAppDispatch,
} from "../../store";
import { 
  openToast,
} from "../../components/atoms/Toast/slice";
import { 
  InputText,
} from "../../components/atoms/Input/InputText";

export default function PageTemplatesList () {
  // TABLE COLUMN
  const columns = [
    {
      header: () => <span className="text-[14px]">Page ID</span>,
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
      header: () => <span className="text-[14px]">Page Name</span>,
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
      header: () => <span className="text-[14px]">Uploaded By</span>,
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
      header: () => <span className="text-[14px]">Action</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-5">
          <button>
            <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableView} 
              onClick={() => {
                onClickPageTemplateView(info.getValue());
              }}
            />
          </button>
          <button>
            <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableEdit} 
              onClick={() => {
                onClickPageTemplateEdit(info.getValue(), info?.row?.original?.filenameCode, info?.row?.original?.name, info?.row?.original?.shortDesc);
              }}
            />
          </button>
          <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableDelete}
            onClick={() => {
              onClickPageTemplateDelete(info.getValue());
            }}
          />
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
  const [pageLimit, setPageLimit] = useState(5);
  const [direction, setDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  // DELETE MODAL STATE
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteModalTitle, setDeleteModalTitle] = useState('');
  const [deleteModalBody, setDeleteModayBody] = useState('');
  const [deletedId, setDeletedId] = useState(0);
  // FORM MODAL STATE
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedId, setEditedId] = useState(0);
  const [editPageName, setEditPageName] = useState('');
  const [editPageDescription, setEditPageDescription] = useState('');
  const [editPageFileName, setEditPageFileName] = useState('');

  // RTK GET DATA
  const fetchQuery = useGetPageTemplateQuery({
    pageIndex,
    limit: pageLimit,
    sortBy,
    direction,
    search,
  }, {
    refetchOnMountOrArgChange: true,
  });
  const { data, isFetching, isError } = fetchQuery;
  // RTK DELETE
  const [ deletedPageTemplate, { isLoading: isLoadingDelete } ] = useDeletePageTemplateMutation();
  // RTK EDIT
  const [ editedPageTemplate, { isLoading: isLoadingEdit } ] =  useEditPageTemplateMutation();

  useEffect(() => {
    if (data) {
      setListData(data?.pageTemplateList?.templates);
      setTotal(data?.pageTemplateList?.total);
    };
  }, [data])

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    };
  }, []);

  // FUNCTION FOR VIEW PAGE TEMPLATE
  const onClickPageTemplateView = (id: number) => {
    console.log(id);
  };

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
            title: 'Success Delete Page Template',
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
            title: 'Failed Delete Page Template',
            message: 'Something went wrong!',
          }),
        );
      })
  };

  const onClickPageTemplateDelete = (id: number) => {
    setDeletedId(id);
    setDeleteModalTitle(`Are you sure?`);
    setDeleteModayBody(`Do you want to delete this Page Template?`);
    setOpenDeleteModal(true);
  };

  // FUNCTION FOR EDIT PAGE TEMPLATE
  const submitEditUser = () => {
    const payload = {
      id: Number(editedId),
      filenameCode: editPageFileName,
      name: editPageName,
      shortDesc: editPageDescription,
    };    
    editedPageTemplate(payload)
      .unwrap()
      .then(async (result: any) => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('page-template.edit.success-msg', { name: result.pageTemplateUpdate.name }),
          })
        );
        setOpenEditModal(false);
        await fetchQuery.refetch();
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t('page-template.edit.failed-msg', { name: payload.name }),
          })
        )
        setOpenEditModal(false);
      })
  };
  
  const onClickPageTemplateEdit = (id: number, filenameCode: string, name: string, description: string) => {
    setEditedId(id);
    setEditPageName(name);
    setEditPageDescription(description);
    setEditPageFileName(filenameCode);
    setOpenEditModal(true);
  };
  
  return (
    <React.Fragment>
      <ModalConfirm
        open={openDeleteModal}
        title={deleteModalTitle}
        message={deleteModalBody}
        cancelTitle="Cancel"
        submitTitle="Yes"
        submitAction={submitDeleteUser}
        cancelAction={() => {
          setOpenDeleteModal(false);
        }}
        loading={isLoadingDelete}
        icon={WarningIcon}
        btnSubmitStyle=''
      />
      <ModalForm
        open={openEditModal}
        loading={isLoadingEdit}
        formTitle="Page Template"
        submitTitle={t('btn.save-alternate')}
        cancelTitle={t('btn.cancel')}
        cancelAction={() => {
          setOpenEditModal(false);
        }}
        submitAction={submitEditUser}
      >
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
      </ModalForm>
      <TitleCard
        title={t('page-template.list.title')}
        topMargin="mt-2" 
        TopSideButtons={
          <Link to='new' className="btn btn-primary flex flex-row gap-2 rounded-xl">
            {t("page-template.list.button-add")}
          </Link>
        }
        SearchBar={
          <InputSearch 
            onBlur={(e: any) => {
              setSearch(e.target.value);
            }}
            placeholder="Search"
          />
        }
      >
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
    </React.Fragment>
  )
}
