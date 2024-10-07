import Typography from '@/components/atoms/Typography';
import CkEditor from '@/components/atoms/Ckeditor';
import ErrorSmallIcon from '@/assets/error-small.svg';

export default function TextEditor({ title, value, disabled, onChange, error, helperText }: any) {
  return (
    <div className="flex flex-col">
      <Typography type="body" size="s" weight="bold">
        {title}
      </Typography>
      <CkEditor data={value} onChange={onChange} disabled={disabled} />
      {error && (
        <div className="flex flex-row px-1">
          <img src={ErrorSmallIcon} className="mr-3" />
          <p className="text-reddist text-sm">{helperText}</p>
        </div>
      )}
    </div>
  );
}
