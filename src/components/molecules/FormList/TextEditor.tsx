import Typography from '@/components/atoms/Typography';
import CkEditor from '@/components/atoms/Ckeditor';
import { t } from 'i18next';

export default function TextEditor({ key, name }: any) {
  return (
    <div key={key}>
      <Typography type="body" size="m" weight="bold" className="w-56 mt-5 ml-1">
      {t('components.molecules.text-editor')}
      </Typography>
      <div className="flex flex-row mt-5">
        <Typography type="body" size="m" weight="bold" className="w-56 mt-5 ml-1">
          {name}
        </Typography>
        <CkEditor />
      </div>
      <div className="border my-10" />
    </div>
  );
}
