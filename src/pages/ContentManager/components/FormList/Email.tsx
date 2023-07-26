import Typography from '@/components/atoms/Typography';
import { InputText } from '@/components/atoms/Input/InputText';

export default function Email({ key, name, onChange }: any) {
  return (
    <div key={key}>
      <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
        Email
      </Typography>
      <InputText
        labelTitle={name}
        labelStyle="font-bold text-base w-48"
        direction="row"
        roundStyle="xl"
        onChange={onChange}
      />
      <div className="border my-10" />
    </div>
  );
}
