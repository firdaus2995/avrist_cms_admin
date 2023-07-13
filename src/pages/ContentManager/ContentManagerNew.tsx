import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import { InputText } from '@/components/atoms/Input/InputText';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
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
          <button onClick={() => {}} className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            Submit
          </button>
        </div>
      </div>
    );
  };

  return (
    <TitleCard title="New Homepage Avrist Life" border={true}>
      <div className="ml-2 mt-6">
        <div>
          <div className="grid grid-cols-1 gap-5 w-">
            <InputText
              labelTitle="Page Name"
              labelStyle="font-semi text-base"
              labelRequired
              direction="row"
              themeColor="lavender"
              roundStyle="xl"
              onChange={() => {}}
            />
            <InputText
              labelTitle="Metatilte"
              labelStyle="font-semi text-base"
              labelRequired
              direction="row"
              themeColor="lavender"
              roundStyle="xl"
              onChange={() => {}}
            />
            <InputText
              labelTitle="Slug"
              labelStyle="font-semi text-base"
              labelRequired
              direction="row"
              themeColor="lavender"
              roundStyle="xl"
              onChange={() => {}}
            />
            <InputText
              labelTitle="Meta Description"
              labelStyle="font-semi text-base"
              labelRequired
              direction="row"
              themeColor="lavender"
              roundStyle="xl"
              onChange={() => {}}
            />
            <InputText
              labelTitle="Short Description"
              labelStyle="font-semi text-base"
              labelRequired
              direction="row"
              themeColor="lavender"
              roundStyle="xl"
              onChange={() => {}}
            />
          </div>

          <div className="flex flex-row items-center justify-between">
            <Typography type="heading4" weight="bold" className="mb-2">
              Choose your template
            </Typography>
            <InputSearch onBlur={() => {}} placeholder="Search" />
          </div>

          <div className="flex items-center justify-center">
            <div className="flex flex-row items-center justify-center">
              <Typography type="body" size="m" weight="semi" className="w-96 mt-5">
                Choose Content Type
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
          </div>
        </div>
      </div>
      <Footer />
    </TitleCard>
  );
}
