import Typography from '@/components/atoms/Typography';
import CkEditor from '@/components/atoms/Ckeditor';

export default function TextEditor({ 
  title, 
  value,
  disabled,
  onChange,
}: any) {
  return (
    <div className='flex flex-col gap-2'>
      <Typography type="body" size="m" weight="bold">
        {title}
      </Typography>
      <CkEditor
        data={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
