import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useGetRolesQuery, useRoleHapusMutation } from '../../services/Roles/rolesApi';
import ModalConfirmLeave from '../../components/molecules/ModalConfirm';
import Table from '../../components/molecules/Table';
import type { SortingState } from '@tanstack/react-table';
import TableEdit from "../../assets/table-edit.png";
import TableDelete from "../../assets/table-delete.png";
import TableView from "../../assets/table-view.png";
import DefaultPage from "../../assets/pages/Default.png";
import WarningIcon from "../../assets/warning.png";
import { InputSearch } from '../../components/atoms/Input/InputSearch';
import PaginationComponent from '../../components/molecules/Pagination';
import Modal from '../../components/atoms/Modal';

const CreateButton = () => {
  return (
    <div className="inline-block float-right">
      <Link to="new">
        <button className="btn normal-case btn-primary text-xs whitespace-nowrap">
          <div className='flex flex-row gap-2 items-center justify-center'>
            Page Registration
          </div>
        </button>
      </Link>
    </div>
  );
};

export default function PageList() {
  const [showComfirm, setShowComfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setmessageConfirm] = useState('');
  const [idDelete, setIdDelete] = useState(0);
  const fetchQuery = useGetRolesQuery({
    pageIndex: 0,
    limit: 100,
    direction: '',
    search: '',
    sortBy: '',
  });
  const { data } = fetchQuery;
  const [hapusRole, { isLoading: hapusLoading }] = useRoleHapusMutation();
  const [searchData, setSearchData] = useState('');
  const [listData, setListData] = useState([]);

  const [openModalView, setOpenModalView] = useState(false);

  const onConfirm = (id: number, name: string) => {
    setIdDelete(id);
    setTitleConfirm('Are you sure?');
    setmessageConfirm(`Do you want to delete role ${name}? \n Once you delete this role, this role won't be recovered`);
    setShowComfirm(true);
  };

  // const onDelete = () => {
  //   hapusRole({ id: idDelete })
  //     .unwrap()
  //     .then(async d => {
  //       setShowComfirm(false);
  //       dispatch(
  //         openToast({
  //           type: 'success',
  //           title: 'Success delete',
  //           message: d.roleDelete.message,
  //         }),
  //       );
  //       await fetchQuery.refetch();
  //     })
  //     .catch(err => {
  //       setShowComfirm(false);

  //       console.log(err);
  //       dispatch(
  //         openToast({
  //           type: 'error',
  //           title: 'Gagal delete',
  //           message: 'Oops gagal delete',
  //         }),
  //       );
  //     });
  // };

  // useEffect(() => {
  //   if(data){
  //     setListData(data?.roleList?.roles)
  //   }
  // }, [data])

  // useEffect(() => {
  //   void fetchQuery.refetch()
  // }, [])

  useEffect(() => {
    const filtered = data?.roleList?.roles?.filter((val) => (
      val?.id?.includes(searchData) ||
      val?.name?.includes(searchData) ||
      val?.description?.includes(searchData)
    ));

    setListData(filtered)

  }, [searchData])

  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      // setSortBy(sortModel[0].id)
      // setDirection(sortModel[0].desc ? "desc" : "asc")
    }
  }, []);

  const pageData = [
    {
      id: 1,
      name: 'Home',
      uploadBy: 'Admin',
    },
    {
      id: 2,
      name: 'Menu',
      uploadBy: 'Admin',
    }
  ]

  const COLUMNS = [
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
      accessorKey: 'uploadBy',
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
      enableSorting: true,
      cell: (info: any) => (
        <div className="flex gap-5">
          <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableView}
            onClick={() => {
              setOpenModalView(true);
            }}
          />
          <Link to={`edit/${info.getValue()}`}>
            <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableEdit} />
          </Link>
          <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableDelete}
            onClick={() => {
              onConfirm(info.getValue(), info?.row?.original?.name);
            }}
          />
        </div>
      ),
    },
  ];

  const modalViewPage = () => {
    return (
      <Modal open={openModalView} toggle={() => { setOpenModalView(false); }} title="" width={720} height={640}>
        <div className='flex flex-row justify-between mb-5 font-bold text-lg'>
          Page Template - Default Page
          <div role='button' onClick={() => { setOpenModalView(false); }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <div className='font-semibold my-2'>
          Preview
        </div>
        <div className='py-4 flex items-center justify-center flex-col'>
          <img src={DefaultPage} alt="iconModal" className='w-[80vh]' />
        </div>
      </Modal>
    )
  }

  return (
    <>
      <ModalConfirmLeave
        open={showComfirm}
        cancelAction={() => {
          setShowComfirm(false);
        } }
        title={titleConfirm}
        cancelTitle="Cancel"
        message={messageConfirm}
        // submitAction={onDelete}
        submitTitle="Yes"
        loading={hapusLoading}
        icon={WarningIcon} btnType={''}      />
      {modalViewPage()}
      <TitleCard 
        title="Page Template" 
        topMargin="mt-2" 
        SearchBar={
          <InputSearch 
            value={searchData} 
            onChange={(e) => { setSearchData(e.target.value); }} 
            onBlur={(e: any) => {
              console.log(e);
            }}
            placeholder="Search"
          />
        } 
        TopSideButtons={<CreateButton />}>
        <div className="overflow-x-auto w-full mb-5">
          <Table
            rows={pageData}
            columns={COLUMNS}
            loading={false}
            error={false}
            manualPagination={true}
            manualSorting={true}
            onSortModelChange={handleSortModelChange}
          />
        </div>
        <PaginationComponent
          page={1}
          setPage={() => null}
          total={100}
          pageSize={10}
          setPageSize={() => null}
        />
      </TitleCard>
    </>
  );
}
