import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import DropDown from '@/components/molecules/DropDown';

export default function ContentManagerNew() {
  const Footer = () => {
    return (
      <div className="flex justify-end mt-10">
        <div className="flex flex-row p-2 gap-2">
          <button onClick={() => {}} className="btn btn-outline text-xs btn-sm w-28 h-10">
            Cancel
          </button>
          <button
            onClick={() => {}}
            className="btn btn-outline border-secondary-warning text-xs text-secondary-warning btn-sm w-28 h-10">
            Save as Draft
          </button>
          <button
            onClick={() => {}}
            className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            Submit
          </button>
        </div>
      </div>
    );
  };

  return (
    <TitleCard title="New Homepage Avrist Life" border={true}>
      <div className="ml-2 mt-6">
        <div className="grid grid-cols-1 gap-5 w-">
          <InputText
            labelTitle="ID"
            labelStyle="font-bold text-base"
            direction="row"
            themeColor="lavender"
            roundStyle="xl"
            onChange={() => {}}
          />
          <InputText
            labelTitle="Title"
            labelStyle="font-bold text-base"
            direction="row"
            themeColor="lavender"
            roundStyle="xl"
            onChange={() => {}}
          />
          <div className="flex flex-row items-center">
            <Typography type="body" size="m" weight="bold" className="w-56 mt-5 ml-1">
              Category
            </Typography>
            <DropDown
              defaultValue="item1"
              items={[
                {
                  value: 'item1',
                  label: 'Items 1',
                },
                {
                  value: 'item2',
                  label: 'Items 2',
                },
              ]}
            />
          </div>
          <div className="flex flex-row">
            <Typography type="body" size="m" weight="bold" className="w-56 mt-5 ml-1">
              Short Description
            </Typography>
            <TextArea
              labelTitle=""
              placeholder={'Enter description'}
              // value={description}
              containerStyle="rounded-3xl"
              onChange={e => {
                // setDescription(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="border border-primary my-10" />

      <div>
        <Typography type="body" size="m" weight="bold" className="my-5 ml-1">
          Looping Banner
        </Typography>
        <div className="rounded-xl shadow-md p-5 mb-10">
          <InputText
            labelTitle="Text Field"
            labelStyle="font-bold text-base"
            direction="row"
            themeColor="lavender"
            roundStyle="xl"
            onChange={() => {}}
          />
        </div>

        <div className="flex justify-end">
          <button className="btn btn-outline border-primary text-xs text-primary btn-sm h-10 w-52">
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
              Add Data
            </div>
          </button>
        </div>
      </div>

      <div className="border border-primary my-10" />

      <Footer />
    </TitleCard>
  );
}
