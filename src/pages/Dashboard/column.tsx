export const COLUMNS = [
  {
    header: () => <span className="text-[14px]">Nama Role</span>,
    accessorKey: 'name',
    enableSorting: true,
    cell: (info: any) => (
      <p className="text-[14px] truncate w-[140px]">
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
      <p className="text-[14px]  truncate w-[140px]">
        {info.getValue() && info.getValue() !== '' && info.getValue() !== null
          ? info.getValue()
          : '-'}
      </p>
    ),
  },
  {
    header: () => <span className="text-[14px]">Aksi</span>,
    accessorKey: 'description',
    enableSorting: true,
    cell: (info: any) => (
      <div>
        <button className="btn btn-primary">Edit</button>
        <button className="btn btn-secondary">Detail</button>
        <button className="btn ">Delete</button>
      </div>
    ),
  },
];
