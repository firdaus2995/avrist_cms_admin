import Typography from '@/components/atoms/Typography';
import CkEditor from '@/components/atoms/Ckeditor';

export default function TextEditor({ key, name }: any) {
  return (
    <div key={key}>
      <Typography type="body" size="m" weight="bold" className="w-60 mt-5 ml-1">
        Text Editor
      </Typography>
      <div className="flex flex-row mt-5">
        <Typography type="body" size="m" weight="bold" className="w-60 mt-5 ml-1">
          {name}
        </Typography>
        <CkEditor />
      </div>
      <div className="border my-10" />
    </div>
  );
}
