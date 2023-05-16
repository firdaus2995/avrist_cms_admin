import { useTranslation } from 'react-i18next';
import DropDown from '../../components/molecules/DropDown';
import DropDownList from '../../components/molecules/DropDownList';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function Dashboard() {
  const { t } = useTranslation();


  const API_URL = "http://109.123.234.62:8095";
  const UPLOAD_ENDPOINT = "files/image/upload";

  function uploadAdapter(loader) {
    return {
      upload: async () => {
        return await new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("files", file);
            // let headers = new Headers();
            // headers.append("Origin", "http://localhost:3000");
            fetch(`${API_URL}/${UPLOAD_ENDPOINT}`, {
              method: "post",
              body
              // mode: "no-cors"
            })
              .then(async (res) => await res.json())
              .then((res) => {
                resolve({
                  default: `${API_URL}/${res.filename}`
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      }
    };
  }
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <br />
      <button className="btn btn-primary btn-sm ">This button made with daisyui</button>
      <br />
      <h1 className="my-10"> {t('dashboard.sample') ?? ''}</h1>
      <div className="w-96">
        <DropDown
          defaultValue="Ayam"
          items={[
            {
              value: 'Ayam',
              label: 'Daging Ayam',
            },
            {
              value: 'Sapi',
              label: 'Daging Sapi',
            },
          ]}
        />
      </div>
      <h1 className="m-6">INI LIST</h1>
      <div className="w-80">
        <DropDownList
          defaultValue={['Ayam', 'Sapi', 'Ular']}
          items={[
            {
              value: 'Ayam',
              label: 'Daging Ayam',
            },
            {
              value: 'Sapi',
              label: 'Daging Sapi',
            },
            {
              value: 'Ular',
              label: 'Daging Ular',
            },
            {
              value: 'Domba',
              label: 'Daging Domba',
            },
            {
              value: 'Manusia',
              label: 'Daging Manusia',
            },
          ]}
        />
      </div>
      <div className='my-5'>
        <CKEditor
          editor={ ClassicEditor }
          config={{
            extraPlugins: [uploadPlugin]
          }}
          onReady={ editor => {
              // You can store the "editor" and use when it is needed.
              console.log( 'Editor is ready to use!', editor );
          } }
          onChange={ ( event, editor ) => {
              const data = editor.getData();
              console.log( { event, editor, data } );
          } }
          onBlur={ ( event, editor ) => {
              console.log( 'Blur.', editor );
          } }
          onFocus={ ( event, editor ) => {
              console.log( 'Focus.', editor );
          } }
        />
      </div>
    </div>
  );
}
