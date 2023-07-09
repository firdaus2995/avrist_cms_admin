import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import { InputText } from '@/components/atoms/Input/InputText';
import CkEditor from '@/components/atoms/Ckeditor';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import DropDown from '@/components/molecules/DropDown';

export default function PageManagementNew() {
  const Footer = () => {
    return (
      <div className="flex justify-end mt-10">
        <div className="flex flex-row p-2 gap-2">
          <button onClick={() => {}} className="btn btn-outline text-xs btn-sm w-28 h-10">
            Cancel
          </button>
          <button onClick={() => {}} className="btn btn-success text-xs btn-sm w-28 h-10">
            Submit
          </button>
        </div>
      </div>
    );
  };
  const Label = ({ title, value }: any) => {
    return (
      <div className="flex flex-row">
        <Typography type="body" size="m" weight="medium" className="my-2 w-48">
          {title}
        </Typography>
        <Typography type="body" size="s" weight="regular" className="text-body-text-2 my-2 mr-5">
          {value}
        </Typography>
      </div>
    );
  };
  return (
    <TitleCard title="New Page Management" border={true}>
      <div className="ml-2 mt-6">
        <div>
          <Typography type="heading4" weight="bold" className="mb-5">
            General Information
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

          <div className="my-10">
            <Label title="Content" />
            <CkEditor />
          </div>

          <div className="btn-group flex mb-10">
            <button className="btn btn-primary text-xs flex-1">Page List</button>
            <button className="btn btn-disabled text-xs flex-1">My Task</button>
          </div>

          <div className="flex flex-row items-center justify-between">
            <Typography type="heading4" weight="bold" className="mb-2">
              Choose your template
            </Typography>
            <InputSearch onBlur={() => {}} placeholder="Search" />
          </div>

          <div className="flex items-center justify-center">
            <div className="flex flex-row items-center justify-center">
              <Typography type="body" size="m" weight="medium" className="my-2 w-48">
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
