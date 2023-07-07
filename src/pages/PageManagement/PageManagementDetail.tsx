import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import StatusBadge from './components/StatusBadge';
import Typography from '@/components/atoms/Typography';
import TemplateHome from '@/assets/template-home.jpg';

export default function PageManagementDetail() {
  const Badge = () => {
    return (
      <div className="ml-5">
        <StatusBadge status={''} />
      </div>
    );
  };
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
    <TitleCard title="Homepage - Page Template" titleComponent={<Badge />} border={true}>
      <div className="ml-2 mt-6">
        <div>
          <Typography type="heading4" weight="bold" className="mb-2">
            General Information
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <Label title="Page Name" value="Homepage 1" />
            <Label title="Metatitle" value="Metatitle" />
            <Label title="Short Description" value="Metatitle" />
            <Label title="Metadescription" value="Metatitle" />
            <Label
              title="Short Description"
              value="Halaman home untuk website Avrist Life Insurance"
            />
          </div>
          <Label title="Content" value="-" />
          <Label title="Chosen Template" value="Template Home" />
          <div className="flex justify-center my-5">
            <img src={TemplateHome} />
          </div>
          <Label title="Content Type" value="Homepage Avrist Life" />
          <Label title="Category" value="Solusi Individu" />
        </div>
      </div>
      <Footer />
    </TitleCard>
  );
}
