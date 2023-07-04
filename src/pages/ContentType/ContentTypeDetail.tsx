import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { useGetPostTypeDetailQuery } from '../../services/ContentType/contentTypeApi';
import Table from '@/components/molecules/Table';
import PaginationComponent from '@/components/molecules/Pagination';

export default function ContentTypeDetail() {
  const params = useParams();
  const [id] = useState<any>(Number(params.id));
  const [name, setName] = useState<any>('');
  const [listData, setListData] = useState<any>([]);

  // GO BACK
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  // TABLE PAGINATION STATE
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(5);

  // RTK GET DATA
  const fetchQuery = useGetPostTypeDetailQuery({
    id,
    pageIndex,
    limit: pageLimit,
  });
  const { data } = fetchQuery;

  useEffect(() => {
    if (data) {
      setName(data?.postTypeDetail?.name);
      setListData(data?.postTypeDetail?.attributeList);
      setTotal(data?.postTypeDetail?.total);
    }
  }, [data]);

  useEffect(() => {
    const refetch = async () => {
      await fetchQuery.refetch();
    };
    void refetch();
  }, []);

  const COLUMNS = [
    {
      header: () => <span className="text-[14px]">Attribute Name</span>,
      accessorKey: 'name',
      enableSorting: false,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-'}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">Attribute Type</span>,
      accessorKey: 'fieldType',
      enableSorting: false,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : '-'}
        </p>
      ),
    },
  ];

  return (
    <>
      <TitleCard title={name} topMargin="mt-2" onBackClick={goBack} hasBack={true}>
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
      </TitleCard>
    </>
  );
}
