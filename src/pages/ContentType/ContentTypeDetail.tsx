import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { useGetPostTypeDetailQuery } from '../../services/ContentType/contentTypeApi';
import { useTranslation } from 'react-i18next'; // Import the i18n library
import Table from '@/components/molecules/Table';
import PaginationComponent from '@/components/molecules/Pagination';

export default function ContentTypeDetail() {
  const { t } = useTranslation(); // Initialize the i18n library
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
  const [pageLimit, setPageLimit] = useState(10);

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
      header: () => <span className="text-[14px]">{t('user.content-type-detail.content_type_detail.attribute_name')}</span>,
      accessorKey: 'name',
      enableSorting: false,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : t('user.content-type-detail.table.empty_data')} {/* Translate this */}
        </p>
      ),
    },
    {
      header: () => <span className="text-[14px]">{t('user.content-type-detail.content_type_detail.attribute_type')}</span>,
      accessorKey: 'fieldType',
      enableSorting: false,
      cell: (info: any) => (
        <p className="text-[14px] truncate">
          {info.getValue() && info.getValue() !== '' && info.getValue() !== null
            ? info.getValue()
            : t('user.content-type-detail.table.empty_data')} {/* Translate this */}
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
