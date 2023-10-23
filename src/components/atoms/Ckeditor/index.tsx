import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { t } from 'i18next';

import ErrorSmallIcon from '@/assets/error-small.svg';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { getCredential } from '../../../utils/Credential';

const baseUrl = import.meta.env.VITE_API_URL;

function uploadAdapter(loader: any) {
  return {
    upload: async () => {
      return await new Promise((resolve, reject) => {
        const token = getCredential().accessToken;
        const body = new FormData();
        loader.file.then((file: any) => {
          body.append('image', file);
          fetch(`${baseUrl}/files/image/upload`, {
            method: 'POST',
            body,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(async res => await res.json())
            .then(res => {
              resolve({
                default: `${baseUrl}/${res.message}`,
              });
            })
            .catch(err => {
              reject(err);
            });
        });
      });
    },
  };
}

function uploadPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return uploadAdapter(loader);
  };
}

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
        config={{
          extraPlugins: [uploadPlugin],
        }}
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
