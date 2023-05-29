import TableEdit from "../../assets/table-edit.png";
import TableDelete from "../../assets/table-delete.png";
import { Link } from "react-router-dom";

export const columns = [
  {
    header: () => <span className="text-[14px]">User Id</span>,
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
    header: () => <span className="text-[14px]">User Name</span>,
    accessorKey: 'username',
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
    header: () => <span className="text-[14px]">Email</span>,
    accessorKey: 'email',
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
    header: () => <span className="text-[14px]">Role</span>,
    accessorKey: 'role',
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
    header: () => <span className="text-[14px]">Aksi</span>,
    accessorKey: 'id',
    enableSorting: false,
    cell: (info: any) => (
      <div className="flex gap-5">
        <Link to={`edit/${info.getValue()}`}>
          <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableEdit} />
        </Link>
        <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableDelete}
          onClick={(event: React.SyntheticEvent) => {
            console.log(event);
          }}
        />
      </div>
    ),
  },
];
