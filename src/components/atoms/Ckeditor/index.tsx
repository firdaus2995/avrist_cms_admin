import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { t } from 'i18next';

import ErrorSmallIcon from '@/assets/error-small.svg';
import { CKEditor } from '@ckeditor/ckeditor5-react';

interface ICkEditor {
  data?: string;
  onChange?: (data: string) => void;
  isError?: any;
  helperText?: string;
}

export default function CkEditor({
  data,
  onChange,
  isError,
  helperText,
}: ICkEditor) {
  return (
    <div>
      <CKEditor
        disabled={false}
        data={data ?? ''}
        editor={Editor}
        onChange={(_event: any, editor: any) => {
          const data = editor.getData();
          if (onChange) {
            onChange(data);
          };
        }}
      />
      {
        isError && (
          <div className='flex flex-row px-1 py-2'>
            <img src={ErrorSmallIcon} className='mr-3' />
            <p className='text-reddist text-sm'>{helperText ?? t('components.atoms.required')}</p>
          </div>
        )
      }    
    </div>
  );
}
