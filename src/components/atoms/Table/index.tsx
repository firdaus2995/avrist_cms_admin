import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';

import Sorted from '../../../assets/sorted.png';
import Sorting from '../../../assets/sorting.png';
import NoResultIcon from '../../../assets/no-result.svg';
import './style.css';
import Skeleton from './skeleton';

interface IDataGrid {
  columns: Array<ColumnDef<any>>;
  rows: any[];
  loading: boolean;
  error: boolean;
  manualSorting: boolean;
  manualPagination: boolean;
  onSortModelChange?: (v: SortingState) => void;
}
const Table: React.FC<IDataGrid> = props => {
  const { columns, rows, manualPagination, manualSorting, loading, error, onSortModelChange } =
    props;
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
    },
    manualSorting,
    manualPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSortingRemoval: false,
  });
  React.useEffect(() => {
    if (manualSorting) if (onSortModelChange) onSortModelChange(sorting);
  }, [sorting]);
  return (
    <div className={'w-full h-full relative mb-4'}>
      <table id="react-table" className="w-full  ">
        <thead>
          {table.getHeaderGroups().map((headerGroup, i) => (
            <tr key={i} className="t-head ">
              {headerGroup.headers.map((header, i2) => {
                // let id = header.getContext().column.id
                const canSorted = header.column.getCanSort();
                const isSorted = header.column.getIsSorted();

                return (
                  <th key={i2} className={' text-[16px] '}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className:
                            (header.column.getCanSort()
                              ? 'cursor-pointer select-none flex items-center'
                              : '') +
                            ` flex gap-2 justify-start  flex items-center    break-words ${
                              window.innerWidth <= 1366 ? '' : 'pl-4'
                            }`,
                          onClick: header.column.getToggleSortingHandler(),
                        }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}

                        {canSorted && (isSorted === 'asc' || isSorted === 'desc') && (
                          <img src={Sorted} alt="Sorting" className="w-2" />
                        )}
                        {canSorted && !isSorted && (
                          <img src={Sorting} alt="Sorting" className="w-2" />
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="relative ">
          {loading ? (
            <Skeleton columnsLength={columns.length} />
          ) : rows.length ? (
            table.getRowModel().rows.map((row, i) => {
              return (
                <React.Fragment key={i}>
                  <tr className={'mb-[20px] '}>
                    {row.getVisibleCells().map((cell, i2) => {
                      return (
                        <td
                          key={i2}
                          style={{
                            paddingLeft: 10,
                          }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <ErrorComponent
              colspan={columns.length}
              message={
                error
                  ? 'Maaf data tidak tersedia, mohon coba beberapa saat lagi'
                  : 'Data tidak tersedia'
              }
            />
          )}
        </tbody>
      </table>
    </div>
  );
};
interface IErrorComponent {
  colspan: number;
  message: string;
}
export const ErrorComponent: React.FC<IErrorComponent> = ({ colspan, message }) => {
  return (
    <tr>
      <td className="" colSpan={colspan}>
        <div className="w-full    h-[300px] flex justify-center items-center flex-col">
          <img src={NoResultIcon} width={250} height={250} />
          <p className="font-lato text-gray-400 text-2xl">{message}</p>
        </div>
      </td>
    </tr>
  );
};

export default Table;
