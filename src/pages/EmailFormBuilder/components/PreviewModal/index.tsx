import { useState } from 'react';
import Typography from '@/components/atoms/Typography';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
// import { LoadingCircle } from '@/components/atoms/Loading/loadingCircle';

export default function PreviewModal(props: any) {
  const { open, title, toggle } = props;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className={`modal ${open ? 'modal-open' : ''}`}>
      <div className="modal-box overflow-hidden">
        <div>
          <div>
            <Typography type="body" size="xl" weight="semi" className="truncate mb-3">
              {title}
            </Typography>
            <Typography type="body" size="normal" weight="regular" className="truncate mb-3">
              Deskripsi Singkat
            </Typography>
          </div>
          <button
            onClick={() => toggle()}
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        <div className="sticky max-h-[calc(100vh-10rem)] overflow-y-auto">
          {/* {isLoading && (
            <div className="flex justify-center items-center">
              <LoadingCircle />
            </div>
          )} */}
          <div className="mb-10 p-1">
            <InputText
              labelTitle="Name"
              labelStyle="font-bold	"
              labelRequired
              type="name"
              value={name}
              placeholder={'name'}
              roundStyle="xl"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value);
              }}
            />
            <InputText
              labelTitle="User ID"
              labelStyle="font-bold	"
              labelRequired
              type="name"
              value={name}
              placeholder={'name'}
              roundStyle="xl"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value);
              }}
            />
            <TextArea
              labelTitle={'Description'}
              placeholder="Description"
              onChange={e => {
                setDescription(e.target.value);
              }}
              labelStyle="font-bold w-[200px]"
              value={description}
            />
          </div>
          <div className="flex justify-center items-center">
            <div className="btn btn-primary flex flex-row gap-2 rounded-xl w-80">Submit</div>
          </div>
        </div>
      </div>
    </div>
  );
}
