import { 
  SortingState,
} from "@tanstack/react-table";
import { 
  useCallback, 
  useEffect, 
  useState,
} from "react";
import { 
  Link, 
} from "react-router-dom";

import Table from "../../components/molecules/Table";
import Plus from "../../assets/plus.png";
import PaginationComponent from "../../components/molecules/Pagination";
import { 
  TitleCard,
} from "../../components/molecules/Cards/TitleCard";
import { 
  columns,
} from "./columns";
import { 
  InputSearch,
} from "../../components/atoms/Input/InputSearch";
import { 
  useGetUserQuery,
} from "../../services/User/userApi";

export default function UsersList () {
  const [listData, setListData] = useState([]);
  const [total, setTotal] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(5);
  const [direction, setDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  const [search, setSearch] = useState('');

  const fetchQuery = useGetUserQuery({
    pageIndex,
    limit: pageLimit,
    sortBy,
    direction,
    search,
  });
  const { data, isFetching, isError } = fetchQuery;    

  useEffect(() => {
    if (data) {
      setListData(data?.userList?.users);
      setTotal(data?.userList?.total);
    }
  }, [data])

  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      setSortBy(sortModel[0].id);
      setDirection(sortModel[0].desc ? 'desc' : 'asc');
    };
  }, []);

  return (
    <TitleCard title="User List" 
      topMargin="mt-2" 
      TopSideButtons={
        <Link to='new' className="btn btn-primary flex flex-row gap-2 rounded-xl">
          <img src={Plus} className="w-[24px] h-[24px]" />
          Add New User
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
        rows={listData || []}
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
        }}
        setPage={(page: number) => {
          setPageIndex(page);
        }}
      />
    </TitleCard>
  );
};
