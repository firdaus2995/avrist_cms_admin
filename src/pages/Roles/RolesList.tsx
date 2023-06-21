import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useGetRolesQuery, useRoleHapusMutation } from '../../services/Roles/rolesApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import ModalConfirmLeave from '../../components/molecules/ModalConfirm';
import Table from '../../components/molecules/Table';
import TableEdit from "../../assets/table-edit.png";
import TableDelete from "../../assets/table-delete.png";
import WarningIcon from "../../assets/warning.png";
import { InputSearch } from '../../components/atoms/Input/InputSearch';
import PaginationComponent from '../../components/molecules/Pagination';
import { SortingState } from '@tanstack/react-table';

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
            Add New Role
          </div>
        </button>
      </Link>
    </div>
  );
};

export default function RolesList() {
  const dispatch = useAppDispatch();
  const [showComfirm, setShowComfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setmessageConfirm] = useState('');
  const [idDelete, setIdDelete] = useState(0);
  
  const [hapusRole, { isLoading: hapusLoading }] = useRoleHapusMutation();
  const [search, setSearch] = useState('');
  const [listData, setListData] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(5);
  const [direction, setDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');

  const fetchQuery = useGetRolesQuery({
    pageIndex,
    limit: pageLimit,
    direction,
    search,
    sortBy,
  }, {
    refetchOnMountOrArgChange: true,
  });
  const { data, isFetching, isError } = fetchQuery;

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
      setTotal(data?.roleList?.total);
    }
  }, [data])

  useEffect(() => {
    void fetchQuery.refetch()
  }, [])

  const COLUMNS = [
    {
      header: () => <span className="text-[14px]">Role ID</span>,
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
      header: () => <span className="text-[14px]">Role Name</span>,
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
      header: () => <span className="text-[14px]">Description</span>,
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
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-5">
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

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    };
  }, []);

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
        title="Role List" 
        topMargin="mt-2" 
        SearchBar={
          <InputSearch 
            onBlur={(e: any) => {
              setSearch(e.target.value);
            }}
            placeholder="Search"
          />
        } 
        TopSideButtons={<CreateButton />}>
        <div className="overflow-x-auto w-full mb-5">
          <Table
            rows={listData || ''}
            columns={COLUMNS}
            loading={isFetching}
            error={isError}
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
    </>
  );
}
