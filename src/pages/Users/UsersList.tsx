import { 
  SortingState,
} from "@tanstack/react-table";
import { 
  useCallback,
} from "react";
import { 
  Link, 
} from "react-router-dom";

import Table from "../../components/molecules/Table";
import Plus from "../../assets/plus.png";
import { 
  TitleCard,
} from "../../components/molecules/Cards/TitleCard";
import { 
  columns,
} from "./columns";
import { 
  InputSearch,
} from "../../components/atoms/Input/InputSearch";
import PaginationComponent from "../../components/atoms/Pagination";

export default function UsersList () {
  // FUNCTION FOR SORTING FOR ATOMIC TABLE
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      // CODE HERE
    }
  }, []);

  const ButtonGroup = () => {
    return (
      <div className="flex gap-5">
        <InputSearch 
          onBlur={(e: any) => {
            console.log(e);
          }}
          placeholder="Search"
        />
        <Link to='new' className="btn btn-primary flex flex-row gap-2 rounded-xl">
          <img src={Plus} className="w-[24px] h-[24px]" />
          Add New User
        </Link>
      </div>
    );
  };  

  return (
    <TitleCard title="User List" TopSideButtons={<ButtonGroup />} >
      <Table
        rows={dummy}
        columns={columns}
        loading={false}
        error={false}
        manualPagination={true}
        manualSorting={true}
        onSortModelChange={handleSortModelChange}
      />
      <PaginationComponent
        page={1}
        setPage={() => null}
        total={100}
        pageSize={10}
        setPageSize={() => null}
      />
    </TitleCard>
  );
};

const dummy = [
  {
    userId: '600234563',
    userName: 'Haykal',
    email: 'haykal@barito.tech',
    role: 'Submitter',
  },
  {
    userId: '600234564',
    userName: 'Faris',
    email: 'fariz@barito.tech',
    role: 'Submitter',
  },
  {
    userId: '600234565',
    userName: 'Mitha',
    email: 'mitha@barito.tech',
    role: 'Submitter',
  },
];
