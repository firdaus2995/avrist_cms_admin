import React, { useState, useRef } from 'react';
import UploadDocumentIcon from '@/assets/upload-file-2.svg';
import Document from '@/assets/modal/document-orange.svg';
import Close from '@/assets/close.png';
import { getCredential } from '@/utils/Credential';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import { formatFilename } from '@/utils/logicHelper';
import { LoadingCircle } from '../../atoms/Loading/loadingCircle';
import { t } from 'i18next';

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
    <>
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
            className="tooltip cursor-pointer w-6 h-6 rounded-full hover-bg-light-grey justify-center items-center flex"
            onClick={onDeletePress}>
            <img src={Close} className="w-5 h-5" />
          </div>
        </div>
      </div>
    </>
  );
};

export default function FileUploaderBase({
  isDocument,
  multiple,
  id,
  disabled,
  label,
  maxSize,
  onFilesChange,
  onAltTextChange,
}: any) {
  const dispatch = useAppDispatch();
  const [filesData, setFilesData] = useState<any>([]);
  const [isUploadLoading, setIsUploadLoading] = useState<any>(false);
  const [altTexts, setAltTexts] = useState<string[]>([]);
  const inputRef = useRef<any>(null);

  const formatData = () => {
    return filesData.map((data: any, index: any) => {
      return {
        imageUrl: data.name,
        altText: altTexts[index] || '',
      };
    });
  };

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
    setIsUploadLoading(true);
    const token = getCredential().accessToken;
    const body = new FormData();
    const fileName = formatFilename(files[0].name);

    const defaultFileSize = isDocument ? maxDocSize : maxImgSize;
    const maxFileSize = maxSize || defaultFileSize;

    if (files[0].size > maxFileSize) {
      dispatch(
        openToast({
          type: 'error',
          title: t('components.molecules.file.too-large'),
          message: t('components.molecules.file.max'),
        }),
      );
      return;
    }

    if (filesData.some((item: any) => item.name === fileName)) {
      dispatch(
        openToast({
          type: 'error',
          title: t('components.molecules.file.duplicated'),
          message: t('components.molecules.file.already-uploaded'),
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
            title: t('components.molecules.file.failed'),
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
          title: t('components.molecules.file.error'),
        }),
      );
    }
    setIsUploadLoading(false);
  };

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={e => {
          e.preventDefault();
        }}
        className={`min-w-[150px] bg-white border-dashed border-[2px] border-lavender rounded-xl`}>
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
              <img className="w-12" src={UploadDocumentIcon} alt="upload" />
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
      <p className="text-body-text-3 text-xs mt-2">{`Only Support format ${
        isDocument ? '.pdf' : '.jpg, .jpeg, .png'
      }`}</p>
      <div>
        {filesData.map((data: any, index: any) => {
          return (
            <div key={index}>
              <FileItem
                {...data}
                onDeletePress={() => {
                  const newData = filesData.filter((_: any, idx: number) => idx !== index);
                  setFilesData(newData);
                  onFilesChange(newData);
                }}
              />
              {!isDocument && (
                <div>
                  <label htmlFor={index}>Alt Text</label>
                  <input
                    type="text"
                    id={index}
                    name={index}
                    onChange={e => {
                      // Update the altTexts array with the new alt text
                      const newAltTexts = [...altTexts];
                      newAltTexts[index] = e.target.value;
                      setAltTexts(newAltTexts);

                      // Call the onAltTextChange function with the updated altTexts array
                      onAltTextChange(newAltTexts);

                      console.log(newAltTexts);
                    }}
                    value={altTexts[index] || ''}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div>
        {isUploadLoading && (
          <div className="flex flex-row items-center justify-center h-16 p-2 mt-3 rounded-xl bg-light-purple-2">
            <LoadingCircle />
          </div>
        )}
      </div>
      {/* Combine onFilesChange and onAltTextChange into a single value */}
      <pre>{JSON.stringify({ value: formatData() }, null, 2)}</pre>
    </>
  );
}
