import React, { useCallback, useState } from "react";
import { SortingState } from "@tanstack/react-table";
import { t } from "i18next";
import { Link, useNavigate } from "react-router-dom";

import Plus from "../../assets/plus.png";
import Table from "@/components/molecules/Table";
import TableEdit from "../../assets/table-edit.png";
import TableView from "../../assets/table-view.png";
import TableDelete from "../../assets/table-delete.png";
import ModalConfirmLeave from "@/components/molecules/ModalConfirm";
import WarningIcon from "../../assets/warning.png";
import { InputSearch } from "@/components/atoms/Input/InputSearch";
import { TitleCard } from "@/components/molecules/Cards/TitleCard";
import { useAppDispatch } from "@/store";

export default function EmailFormBuilderList () {  
  // TABLE COLUMN
  const columns = [
    {
      header: () => <span className="text-[14px]">Form Name</span>,
      accessorKey: 'formName',
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
      accessorKey: 'link',
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
                onClickEmailFormBuilderView(info.getValue());
              }}
            />
          </button>
          <button>
            <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableEdit} 
              onClick={() => {
                onClickEmailFormBuilderEdit(info.getValue());
              }}
            />
          </button>
          <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableDelete}
            onClick={() => {
              onClickEmailFormBuilderDelete(info.getValue());
            }}
          />
        </div>
      ),
    },
  ];
  
  const navigate  = useNavigate();
  const dispatch = useAppDispatch();
  const [listData, setListData] = useState([
    {
      id: 1,
      formName: 'Form Name 1',
      link: 'Form Link 1',
    },
    {
      id: 2,
      formName: 'Form Name 2',
      link: 'Form Link 1',
    },
    {
      id: 3,
      formName: 'Form Name 3',
      link: 'Form Link 1',
    },  
  ]);
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

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    };
  }, []);

  // FUNCTION FOR DELETE PAGE TEMPLATE
  const submitDeleteEmailFormBuilder = () => {
    console.log(deletedId);
  };
  
  // TABLE FUNCTION FOR VIEW EMAIL FORM BUILDER
  const onClickEmailFormBuilderView = (id: number) => {
    console.log(id);
  };

  // TABLE FUNCTION FOR EDIT EMAIL FORM BUILDER
  const onClickEmailFormBuilderEdit= (id: number) => {
    navigate(`edit/${id}`);
  };

  // TABLE FUNCTION FOR DELETE EMAIL FORM BUILDER
  const onClickEmailFormBuilderDelete= (id: number) => {
    setDeletedId(id);
    setDeleteModalTitle(`Are you sure?`);
    setDeleteModayBody(`Do you want to delete this form?`);
    setOpenDeleteModal(true);
  };

  return (
    <React.Fragment>
      <ModalConfirmLeave
        open={openDeleteModal}
        title={deleteModalTitle}
        message={deleteModalBody}
        cancelTitle="Cancel"
        submitTitle="Yes"
        submitAction={submitDeleteEmailFormBuilder}
        cancelAction={() => {
          setOpenDeleteModal(false);
        }}
        // loading={isLoadingDelete}
        icon={WarningIcon}
        btnType=''
      />
      <TitleCard
        title={t('email-form-builder.list.title')}
        topMargin="mt-2" 
        TopSideButtons={
          <Link to='new' className="btn btn-primary flex flex-row gap-2 rounded-xl">
            <img src={Plus} className="w-[24px] h-[24px]" />
            {t("email-form-builder.list.button-add")}
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
          // loading={isFetching}
          // error={isError}
        />

      </TitleCard>
    </React.Fragment>
  )
}
