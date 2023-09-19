import { useState, useRef } from 'react';
import UploadDocumentIcon from '@/assets/upload-file-2.svg';
import Document from '@/assets/modal/document-orange.svg';
import Close from '@/assets/close.png';
import { getCredential } from '@/utils/Credential';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import { formatFilename } from '@/utils/logicHelper';

const baseUrl = import.meta.env.VITE_API_URL;
const maxDocSize = import.meta.env.VITE_MAX_FILE_DOC_SIZE;
const maxImgSize = import.meta.env.VITE_MAX_FILE_IMG_SIZE;

function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2).toString() + ' ' + sizes[i];
}

const FileItem = (props: any) => {
  const { name, value, onDeletePress } = props;

  return (
    <div className="flex flex-row items-center h-16 p-2 mt-3 rounded-xl bg-light-purple-2">
      {value?.type?.startsWith('image/') ? (
        <img
          className="object-cover h-12 w-12 rounded-lg mr-3 border"
          src={URL.createObjectURL(value)}
          alt={name}
        />
      ) : (
        <div className="h-12 w-12 flex justify-center items-center bg-light-purple rounded-lg mr-3">
          <img className="h-9 w-9" src={Document} alt="document" />
        </div>
      )}
      <div className="flex flex-1 h-14 justify-center flex-col">
        <p className="truncate w-52">{name}</p>
        <p className="text-body-text-3 text-xs">{value ? bytesToSize(value?.size) : ''}</p>
      </div>
      <div className="h-11">
        <div
          data-tip={'Delete'}
          className="tooltip cursor-pointer w-6 h-6 rounded-full hover:bg-light-grey justify-center items-center flex"
          onClick={onDeletePress}>
          <img src={Close} className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default function FileUploaderBaseV2({
  isDocument,
  multiple,
  onFilesChange,
  id,
  disabled,
  label,
  maxSize,
}: any) {
  const dispatch = useAppDispatch();
  const [filesData, setFilesData] = useState<any>([]);

  const inputRef = useRef<any>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const allowedTypes = isDocument ? ['application/pdf'] : ['image/jpeg', 'image/png'];
    const droppedFiles = Array.from(e.dataTransfer.files);

    const validFiles = droppedFiles.filter(file => allowedTypes.includes(file.type));
    void handleUpload(validFiles);
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    void handleUpload([...e.target.files]);
  };

  const handleUpload = async (files: File[]) => {
    const token = getCredential().accessToken;
    // const refreshToken = getCredential().refreshToken;
    
    const body = new FormData();
    const fileName = formatFilename(files[0].name);

    const defaultFileSize = isDocument ? maxDocSize : maxImgSize;
    const maxFileSize = maxSize || defaultFileSize;

    if (files[0].size > maxFileSize) {
      dispatch(
        openToast({
          type: 'error',
          title: 'File Size Too Large',
          message: 'Please upload a file that is no larger than 5MB.',
        }),
      );
      return;
    }

    if (filesData.some((item: any) => item.name === fileName)) {
      dispatch(
        openToast({
          type: 'error',
          title: 'Duplicate File',
          message: 'File already uploaded',
        }),
      );
      return;
    }

    body.append('file', files[0]);
    body.append('fileType', isDocument ? 'DOCUMENT' : 'IMAGE');
    body.append('fileName', fileName);

    try {
      const response = await fetch(`${baseUrl}/files/upload`, {
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const newFile = { name: fileName, value: files[0], response: responseData.data };
        if (multiple) {
          setFilesData((prevState: any) => {
            const updatedFiles = [...prevState, newFile];
            onFilesChange(updatedFiles);
            return updatedFiles;
          });
        } else {
          setFilesData([newFile]);
          onFilesChange([newFile]);
        }
      } else {
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed Upload',
          }),
        );
      }
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      dispatch(
        openToast({
          type: 'error',
          title: 'Upload Error',
        }),
      );
    }
  };

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={e => {
          e.preventDefault();
        }}
        className="w-[400px] bg-white border-dashed border-[2px] border-lavender rounded-xl">
        {(!filesData.length || multiple) && (
          <label htmlFor={id} className="flex flex-col justify-center items-center cursor-pointer">
            <input
              ref={inputRef}
              id={id}
              type="file"
              className="hidden"
              accept={isDocument ? 'application/pdf' : 'image/png, image/jpeg, image/jpg'}
              onChange={handleChange}
              disabled={disabled}
            />
            <div className="flex flex-col justify-center items-center h-[150px]">
              <img className="w-12" src={UploadDocumentIcon} />
              <span className="text-xs text-center mt-5">
                {label || (
                  <span>
                    Drag and Drop {isDocument ? 'Files' : 'Image'} or click to{' '}
                    <span className="text-primary">Browse</span>
                  </span>
                )}
              </span>
            </div>
          </label>
        )}
      </div>
      <p className="text-body-text-3 text-xs mt-1">{`Only Support format ${
        isDocument ? '.pdf' : '.jpg, .jpeg, .png'
      }`}</p>
      <div>
        {filesData.map((data: any, index: any) => {
          return (
            <FileItem
              key={index}
              {...data}
              onDeletePress={() => {
                const newData = filesData.filter((_: any, idx: number) => idx !== index);
                setFilesData(newData);
                onFilesChange(newData);
              }}
            />
          );
        })}
      </div>
    </>
  );
}
