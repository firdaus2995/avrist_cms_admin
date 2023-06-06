import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useGetRolesQuery, useRoleHapusMutation } from '../../services/Roles/rolesApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import ModalConfirmLeave from '../../components/molecules/ModalConfirm';
import Table from '../../components/molecules/Table';
import type { SortingState } from '@tanstack/react-table';
import TableEdit from '../../assets/table-edit.png';
import TableView from '../../assets/table-view.png';
import TableDelete from '../../assets/table-delete.png';
import FilterIcon from '../../assets/filter.svg';
import ArchiveBox from '../../assets/archive-box.svg';
import WarningIcon from '../../assets/warning.png';
import { InputSearch } from '../../components/atoms/Input/InputSearch';
import PaginationComponent from '../../components/molecules/Pagination';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string;
}

const TopRightButton = () => {
  return (
    <div className="flex flex-row">
      <FilterButton />
      <CreateButton />
    </div>
  );
};

const ArchiveButton = () => {
  return (
    <div className="inline-block float-right">
      <Link to="archive">
        <button className=" border-secondary-warning border-[1px] rounded-xl w-36 py-3">
          <div className="flex flex-row gap-2 items-center justify-center text-xs normal-case font-bold text-secondary-warning">
            <img src={ArchiveBox} className="w-6 h-6 mr-1" />
            Archive
          </div>
        </button>
      </Link>
    </div>
  );
};

const FilterButton = () => {
  return (
    <div className="inline-block float-right mr-5">
      <button className=" border-grey border-[1px] rounded-xl px-3 py-3">
        <div className="flex flex-row gap-2 items-center justify-center">
          <img src={FilterIcon} className="w-6 h-6" />
        </div>
      </button>
    </div>
  );
};

const CreateButton = () => {
  return (
    <div className="inline-block float-right">
      <Link to="new">
        <button className="btn normal-case btn-primary text-xs whitespace-nowrap">
          <div className="flex flex-row gap-2 items-center justify-center">
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setMessageConfirm] = useState('');
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
  const [listData, setListData] = useState<any>([]);

  const onConfirm = (id: number, name: string) => {
    setIdDelete(id);
    setTitleConfirm('Are you sure?');
    setMessageConfirm(
      `Do you want to delete role ${name}? \n Once you delete this role, this role won't be recovered`,
    );
    setShowConfirm(true);
  };

  const onDelete = () => {
    hapusRole({ id: idDelete })
      .unwrap()
      .then(async d => {
        setShowConfirm(false);
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
        setShowConfirm(false);

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
    if (data) {
      setListData(data?.roleList?.roles);
    }
  }, [data]);

  useEffect(() => {
    void fetchQuery.refetch();
  }, []);

  useEffect(() => {
    const filtered = data?.roleList?.roles?.filter((val: Role | undefined) =>
      String(val?.id).includes(searchData) ||
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      (val?.name && val?.name.includes(searchData)) ||
      (val?.description && val?.description.includes(searchData)),
    );
  
    setListData(filtered);
  }, [searchData]);

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
      enableSorting: false,
      cell: () => (
        <span className="inline-block rounded-min text-gray-600 bg-gray-100 px-2 py-1 text-xs font-bold mr-3">
          Default
        </span>
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
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex gap-5">
          <div className="tooltip" data-tip="View">
            <img
              className={`cursor-pointer select-none flex items-center justify-center`}
              src={TableView}
            />
          </div>
          <Link to={`edit/${info.getValue()}`}>
            <div className="tooltip" data-tip="Edit">
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableEdit}
              />
            </div>
          </Link>
          <div className="tooltip" data-tip="Delete">
            <img
              className={`cursor-pointer select-none flex items-center justify-center`}
              src={TableDelete}
              onClick={() => {
                onConfirm(info.getValue(), info?.row?.original?.name);
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <ModalConfirmLeave
        open={showConfirm}
        cancelAction={() => {
          setShowConfirm(false);
        }}
        title={titleConfirm}
        cancelTitle="Cancel"
        message={messageConfirm}
        submitAction={onDelete}
        submitTitle="Yes"
        loading={hapusLoading}
        icon={WarningIcon}
        btnType={''}
      />
      <TitleCard
        title="Page List"
        topMargin="mt-2"
        SearchBar={
          <InputSearch
            value={searchData}
            onChange={e => {
              setSearchData(e.target.value);
            }}
            onBlur={(e: any) => {
              console.log(e);
            }}
            placeholder="Search"
          />
        }
        TopSideButtons={<TopRightButton />}>
        <div className="flex flex-row justify-between mb-5">
          <div className="flex flex-row">
            <button className="btn btn-primary text-xs w-40">Page List</button>
            <button className="btn btn-outline text-xs w-40">My Task</button>
          </div>
          <ArchiveButton />
        </div>

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
