import TableEdit from "../../assets/table-edit.png";
import TableDelete from "../../assets/table-delete.png";

export const COLUMNS = [
  {
    header: () => <span className="text-[14px]">Nama Role</span>,
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
    header: () => <span className="text-[14px]">Deskripsi</span>,
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
    header: () => <span className="text-[14px]">Aksi</span>,
    accessorKey: 'action',
    enableSorting: true,
    cell: () => (
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
