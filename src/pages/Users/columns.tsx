import TableEdit from "../../assets/table-edit.png";
import TableDelete from "../../assets/table-delete.png";

export const columns = [
  {
    header: () => <span className="text-[14px]">Nama Role</span>,
    accessorKey: 'userId',
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
    accessorKey: 'userName',
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
    accessorKey: 'action',
    enableSorting: true,
    cell: (info: any) => (
      <div className="flex gap-5">
        <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableEdit}
          onClick={(event: React.SyntheticEvent) => {
            console.log(event);
          }}
        />
        <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableDelete}
          onClick={(event: React.SyntheticEvent) => {
            console.log(event);
          }}
        />
      </div>
    ),
  },
];
