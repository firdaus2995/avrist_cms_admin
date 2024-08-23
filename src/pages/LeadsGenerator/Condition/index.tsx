import Typography from '@/components/atoms/Typography';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import PaginationComponent from '@/components/molecules/Pagination';
import { styleButton } from '@/utils/styleButton';
import { useNavigate } from 'react-router-dom';

interface IListItem {
  title: string;
  name: string;
  condition: string;
  total: string;
  date: string;
}

const dummy: IListItem = {
  title: 'ABC',
  name: 'ABC',
  condition: 'ABC',
  total: 'ABC',
  date: 'ABC',
};

const LeadsGeneratorConditions = () => {
  const navigate = useNavigate();

  const arrData: () => IListItem[] = () => {
    const arr: IListItem[] = [];
    for (let i = 0; i < 5; i++) {
      arr.push(dummy);
    }
    return arr;
  };

  return (
    <TitleCard
      title="Conditions"
      topMargin="mt-2"
      TopSideButtons={
        <div
          className={styleButton({ variants: 'primary' })}
          onClick={() => {
            navigate(`/conditions/new`);
          }}>
          Add Condition
        </div>
      }>
      <div className="flex flex-col gap-y-4">
        {/* Table */}
        <div className="flex flex-col gap-y-2">
          {/* Header */}
          <div className="flex gap-x-3 px-4 py-2 bg-light-purple-2 rounded-xl">
            <Typography type="body" size="s" weight="bold" className="w-[5%]">
              No.
            </Typography>
            <Typography type="body" size="s" weight="bold" className="w-[15%]">
              Condition Title
            </Typography>
            <Typography type="body" size="s" weight="bold" className="w-[15%]">
              Result Name
            </Typography>
            <Typography type="body" size="s" weight="bold" className="w-[35%]">
              Condition 1
            </Typography>
            <Typography type="body" size="s" weight="bold" className="w-[10%]">
              Total Condition
            </Typography>
            <Typography type="body" size="s" weight="bold" className="w-[15%]">
              Date Added
            </Typography>
            <Typography type="body" size="s" weight="bold" className="w-[5%]">
              Action
            </Typography>
          </div>
          {/* Body */}
          <div className="bg-table rounded-xl relative">
            {arrData().map((item: IListItem, idx: number) => (
              <div
                key={idx}
                className={`${idx + 1 === arrData().length ? '' : 'border-b border-light-grey'} flex gap-x-3 px-4 py-2`}>
                <Typography type="body" size="s" className="w-[5%]">
                  {idx + 1}
                </Typography>
                <Typography type="body" size="s" className="w-[15%]">
                  {item.title}
                </Typography>
                <Typography type="body" size="s" className="w-[15%]">
                  {item.name}
                </Typography>
                <Typography type="body" size="s" className="w-[35%]">
                  {item.condition}
                </Typography>
                <Typography type="body" size="s" className="w-[10%]">
                  {item.total}
                </Typography>
                <Typography type="body" size="s" className="w-[15%]">
                  {item.date}
                </Typography>
                <div className="flex w-[5%] gap-x-1">
                  <div
                    className={`!min-w-[24px] !h-[24px] !rounded-lg ${styleButton({ variants: 'blues' })}`}
                    onClick={() => {
                      navigate(`/conditions/${idx}`);
                    }}>
                    x
                  </div>
                  <div
                    className={`!min-w-[24px] !h-[24px] !rounded-lg ${styleButton({ variants: 'error' })}`}>
                    x
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <PaginationComponent
          page={1}
          pageSize={5}
          total={5}
          setPage={e => {
            console.log(e);
          }}
        />
      </div>
    </TitleCard>
  );
};

export default LeadsGeneratorConditions;
