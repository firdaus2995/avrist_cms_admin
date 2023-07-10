import { useState } from 'react';
import Table from '@/components/molecules/Table';
import PaginationComponent from '@/components/molecules/Pagination';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import TableEdit from '@/assets/table-edit.png';

export default function CategoryTab(_props: { id: any }) {
  const { t } = useTranslation();

  const [listData] = useState<any>([
    {
      id: 1,
      status: 'waiting_review',
      title: 'Homepage Avrist Life',
      desc: 'Landing Page',
    },
    {
      id: 2,
      status: 'waiting_approval',
      title: 'Homepage Avrist Life 2',
      desc: 'Landing Page',
    },
    {
      id: 3,
      status: 'draft',
      title: 'title',
      desc: 'description',
    },
  ]);

  // TABLE PAGINATION STATE
  const [total] = useState(3);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(5);

  const COLUMNS = [
    {
      header: () => <span className="text-[14px] font-black">Category Name</span>,
      accessorKey: 'title',
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
      header: () => <span className="text-[14px] font-black">Category Description</span>,
      accessorKey: 'desc',
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
      header: () => <span className="text-[14px] font-black">{t('action.action')}</span>,
      accessorKey: 'id',
      enableSorting: false,
      cell: (_info: any) => (
        <div className="flex gap-5">
          <Link to={`category/edit/${_info.getValue()}`}>
            <div className="tooltip" data-tip={t('action.edit')}>
              <img
                className={`cursor-pointer select-none flex items-center justify-center`}
                src={TableEdit}
              />
            </div>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="overflow-x-auto w-full mb-5">
        <Table
          rows={listData}
          columns={COLUMNS}
          loading={false}
          error={false}
          manualPagination={true}
          manualSorting={true}
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
    </>
  );
}
