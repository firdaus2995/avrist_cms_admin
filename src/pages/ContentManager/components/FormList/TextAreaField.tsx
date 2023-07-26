import Typography from '@/components/atoms/Typography';
import { TextArea } from '@/components/atoms/Input/TextArea';

export default function TextAreaField({ key, name, onChange }: any) {
  return (
    <div key={key}>
      <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
        Text Area
      </Typography>
      <div className="flex flex-row">
        <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
          {name}
        </Typography>
        <TextArea
          name={key}
          labelTitle=""
          placeholder={'Enter description'}
          containerStyle="rounded-3xl"
          onChange={onChange}
        />
      </div>
      <div className="border my-10" />
    </div>
  );
}
