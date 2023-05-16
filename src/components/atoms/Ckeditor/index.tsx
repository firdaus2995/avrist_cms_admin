import { CKEditor } from '@ckeditor/ckeditor5-react';
import { getCredential } from '../../../utils/Credential';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
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
export default function CkEditor() {
  return (
    <CKEditor
      disabled={false}
      data={''}
      editor={Editor}
      config={{
        extraPlugins: [uploadPlugin],
      }}
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        console.log(data);
      }}
    />
  );
}
