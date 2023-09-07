import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { useGetPostTypeDetailQuery } from '../../services/ContentType/contentTypeApi';
import ArchiveBox from '@/assets/archive-box.svg';
import MyTaskTab from './tabs/MyTaks/MyTask';
import MainTab from './tabs/Main/Main';
import CategoryTab from './tabs/Category/Category';
import { getCredential } from '@/utils/Credential';

const ArchiveButton = () => {
  return (
    <div className="inline-block float-right">
      <Link to="archive">
        <button className=" border-secondary-warning border-[1px] rounded-xl w-36 py-3">
          <div className="flex flex-row gap-2 items-center justify-center text-xs normal-case font-bold text-secondary-warning">
            <img src={ArchiveBox} className="w-6 h-6 mr-1" />
            Archive
          </div>
        </button>
      </Link>
    </div>
  );
};

export default function ContentManagerDetail() {
  const params = useParams();
  const [id] = useState<any>(Number(params.id));
  const [name, setName] = useState<any>('');
  const [activeTab, setActiveTab] = useState(1);

  // GO BACK
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  // TABLE PAGINATION STATE
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(10);
  // PERMISSION STATE
  const [canAddContentCategory] = useState(() => {
    return !!getCredential().roles.find((element: any) => {
      if (element === "CONTENT_MANAGER_REGISTRATION") {
        return true;
      }
      return false;
    });
  })    

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
    }
  }, [data]);

  useEffect(() => {
    const refetch = async () => {
      await fetchQuery.refetch();
    };
    void refetch();
  }, []);

  const listTabs = [
    {
      name,
      isActive: 1,
    },
    {
      name: 'My Task',
      isActive: 2,
    },
    {
      name: 'Category',
      isActive: 3,
    },
  ];

  const TopRightButton = () => {
    return (
      <div className="flex flex-row">
        <CreateButton />
      </div>
    );
  };
  
  const CreateButton = () => {
    return (
      <div className="inline-block float-right">
        {
          activeTab === 1 ? (
            <Link to="data/new">
              <button className="btn normal-case btn-primary text-xs whitespace-nowrap">
                <div className="flex flex-row gap-2 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add New Data
                </div>
              </button>
            </Link>
          ) : (activeTab === 3 && canAddContentCategory) ? (
            <Link to="category/new">
              <button className="btn normal-case btn-primary text-xs whitespace-nowrap">
                <div className="flex flex-row gap-2 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add New Category
                </div>
              </button>
            </Link>
          ) : (
            <></>
          )
        }
      </div>
    );
  };

  return (
    <>
      <TitleCard
        title={name}
        topMargin="mt-2"
        onBackClick={goBack}
        hasBack={true}
        TopSideButtons={activeTab !== 2 && <TopRightButton />}>
        <div className="flex flex-row justify-between mb-5">
          <div className="btn-group">
            {listTabs.map(val => (
              <button
                key={val.isActive}
                onClick={() => {
                  setActiveTab(val.isActive);
                }}
                className={`btn ${activeTab === val.isActive ? 'btn-primary' : 'bg-gray-200 text-gray-500'} text-xs w-40`}>
                {val.name}
              </button>
            ))}
          </div>
          {activeTab === 1 && <ArchiveButton /> }
        </div>
        {activeTab === 1 && <MainTab id={id} />}
        {activeTab === 2 && <MyTaskTab id={id} />}
        {activeTab === 3 && <CategoryTab id={id} />}
      </TitleCard>
    </>
  );
}
