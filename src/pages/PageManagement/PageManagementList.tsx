import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useGetRolesQuery, useRoleHapusMutation } from '../../services/Roles/rolesApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import ModalConfirmLeave from '../../components/molecules/ModalConfirm';
import Table from '../../components/molecules/Table';
import type { SortingState } from '@tanstack/react-table';
import TableEdit from "../../assets/table-edit.png";
import TableDelete from "../../assets/table-delete.png";
import WarningIcon from "../../assets/warning.png";
import { InputSearch } from '../../components/atoms/Input/InputSearch';
import PaginationComponent from '../../components/molecules/Pagination';

const CreateButton = () => {
  return (
    <div className="inline-block float-right">
      <Link to="new">
        <button className="btn normal-case btn-primary text-xs whitespace-nowrap">
          <div className='flex flex-row gap-2 items-center justify-center'>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create New Page
          </div>
        </button>
      </Link>
    </div>
  );
};

export default function PageManagementList() {
  const dispatch = useAppDispatch();
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

  const onConfirm = (id: number, name: string) => {
    setIdDelete(id);
    setTitleConfirm('Are you sure?');
    setmessageConfirm(`Do you want to delete role ${name}? \n Once you delete this role, this role won't be recovered`);
    setShowComfirm(true);
  };

  const onDelete = () => {
    hapusRole({ id: idDelete })
      .unwrap()
      .then(async d => {
        setShowComfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: 'Success delete',
            message: d.roleDelete.message,
          }),
        );
        await fetchQuery.refetch();
      })
      .catch(err => {
        setShowComfirm(false);

        console.log(err);
        dispatch(
          openToast({
            type: 'error',
            title: 'Gagal delete',
            message: 'Oops gagal delete',
          }),
        );
      });
  };

  useEffect(() => {
    if(data){
      setListData(data?.roleList?.roles)
    }
  }, [data])

  useEffect(() => {
    void fetchQuery.refetch()
  }, [])

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

  const COLUMNS = [
    {
      header: () => <span className="text-[14px]"></span>,
      accessorKey: 'status',
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
      header: () => <span className="text-[14px]">Created by</span>,
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
      header: () => <span className="text-[14px]">Created Date</span>,
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
      header: () => <span className="text-[14px]">Updated Date</span>,
      accessorKey: 'description',
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
          <Link to={`edit/${info.getValue()}`}>
            <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableEdit} />
          </Link>
          <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableDelete}
            onClick={(event: React.SyntheticEvent) => {
              onConfirm(info.getValue(), info?.row?.original?.name);
            }}
          />
        </div>
      ),
    },
  ];

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
        submitAction={onDelete}
        submitTitle="Yes"
        loading={hapusLoading}
        icon={WarningIcon} btnType={''}      />
      <TitleCard 
        title="Page List" 
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
            rows={listData || ''}
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
