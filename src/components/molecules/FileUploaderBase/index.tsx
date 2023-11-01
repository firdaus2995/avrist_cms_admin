import React, { useState, useRef, useEffect } from 'react';
import UploadDocumentIcon from '@/assets/upload-file-2.svg';
import Document from '@/assets/modal/document-orange.svg';
import Close from '@/assets/close.png';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import { formatFilename } from '@/utils/logicHelper';
import { LoadingCircle } from '../../atoms/Loading/loadingCircle';
import { t } from 'i18next';
import { getImageEditable } from '../../../utils/imageUtils';
import restApiRequest from '../../../utils/restApiRequest';

const maxDocSize = import.meta.env.VITE_MAX_FILE_DOC_SIZE;
const maxImgSize = import.meta.env.VITE_MAX_FILE_IMG_SIZE;

function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0 || !bytes) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2).toString() + ' ' + sizes[i];
}

const FileItem = (props: any) => {
  const { name, value, onDeletePress, editMode } = props;

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
          {editMode && (
            <div
              data-tip={'Delete'}
              className="tooltip cursor-pointer w-6 h-6 rounded-full hover-bg-light-grey justify-center items-center flex"
              onClick={onDeletePress}>
              <img src={Close} className="w-5 h-5" />
            </div>
          )}
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
  onCombineDataChange,
  value,
  showMaxSize,
  editMode = false,
  disabledAltText,
}: any) {
  const dispatch = useAppDispatch();
  const [filesData, setFilesData] = useState<any>([]);
  const [isUploadLoading, setIsUploadLoading] = useState<any>(false);
  const [altTexts, setAltTexts] = useState<string[]>([]);
  const inputRef = useRef<any>(null);

  const formatData = () => {
    const formattedData = filesData.map((data: any, index: any) => {
      if (isDocument) {
        return {
          imageUrl: data.response,
        };
      } else {
        return {
          imageUrl: data.response,
          altText: altTexts[index] || '',
        };
      }
    });

    // Call onCombineDataChange here to trigger it whenever formatData is called
    onCombineDataChange(formattedData);

    return formattedData;
  };

  useEffect(() => {
    const combinedData = formatData();
    onCombineDataChange(combinedData);
  }, [filesData, altTexts]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const allowedTypes = isDocument
      ? ['application/pdf']
      : ['image/jpeg', 'image/png', 'image/jpg'];
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
    const fileName = formatFilename(files[0].name);

    const defaultFileSize = isDocument ? maxDocSize : maxImgSize;
    const maxFileSize = maxSize || defaultFileSize;

    if (files[0].size > maxFileSize) {
      dispatch(
        openToast({
          type: 'error',
          title: t('components.molecules.file.too-large'),
          message: t('components.molecules.file.max', { max: maxFileSize.toString().slice(0, 1) }),
        }),
      );
      setIsUploadLoading(false);
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
      setIsUploadLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('fileType', isDocument ? 'DOCUMENT' : 'IMAGE');
    formData.append('fileName', fileName);

    try {
      const response = await restApiRequest('POST', '/files/upload', formData); // Use restApiRequest here
      const newFile = { name: fileName, value: response.data, response: response.data.data };

      if (multiple) {
        setFilesData((prevState: any) => {
          const updatedFiles = [...prevState, newFile];
          onFilesChange(updatedFiles);
          return updatedFiles;
        });
        setAltTexts((prevState: string[]) => {
          const updatedAltTexts = [...prevState, ''];
          onAltTextChange(updatedAltTexts);
          return updatedAltTexts;
        });
      } else {
        setFilesData([newFile]);
        onFilesChange([newFile]);
        setAltTexts(['']);
        onAltTextChange(['']);
      }
    } catch (error) {
      dispatch(
        openToast({
          type: 'error',
          title: t('components.molecules.file.error'),
        }),
      );
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setIsUploadLoading(false);
  };

  function safeParseJSON(jsonString: any) {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return [];
    }
  }

  useEffect(() => {
    const parsedValue = safeParseJSON(value);
    if (parsedValue) {
      if (altTexts.length === 0) {
        // Only set the altTexts if it's empty
        const defaultAltText = parsedValue?.map((item: any) => item?.altText);
        if (defaultAltText) {
          setAltTexts(defaultAltText);
        }
      }

      const loadDefaultValue = async () => {
        const urls = await Promise.all(
          parsedValue.map(async (element: any) => await getImageEditable(element?.imageUrl)),
        );
        if (urls) {
          setFilesData(urls);
        }
      };

      void loadDefaultValue();
    }
  }, [value]);

  return (
    <>
      {(!filesData.length || multiple) && (
        <>
          <div
            onDrop={handleDrop}
            onDragOver={e => {
              e.preventDefault();
            }}
            className={`min-w-[150px] bg-white border-dashed border-[2px] border-lavender rounded-xl`}>
            <label
              htmlFor={id}
              className="flex flex-col justify-center items-center cursor-pointer">
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
          </div>
          <div className="w-full">
            <p className="text-body-text-3 text-xs mt-2">{`Only Support format ${
              isDocument ? '.pdf' : '.jpg, .jpeg, .png'
            }`}</p>
            {showMaxSize ? (
              <p className="text-body-text-3 text-xs">{`Max. ${maxSize
                ?.toString()
                ?.slice(0, 1)} MB`}</p>
            ) : null}
          </div>
        </>
      )}
      <div>
        {filesData.map((data: any, index: any) => {
          return (
            <div key={index}>
              <FileItem
                {...data}
                editMode={editMode}
                onDeletePress={() => {
                  const newData = filesData.filter((_: any, idx: number) => idx !== index);
                  const newAltTexts = [...altTexts];
                  newAltTexts.splice(index, 1);

                  setFilesData(newData);
                  setAltTexts(newAltTexts);
                  onFilesChange(newData);
                  onAltTextChange(newAltTexts);
                }}
              />
              {!isDocument && !disabledAltText && (
                <div className="flex flex-row my-2 items-center">
                  <label htmlFor={index} className="w-16 mr-2">
                    <p className="text-xs font-semibold">Alt Text</p>
                  </label>
                  <input
                    type="text"
                    id={index}
                    name={index}
                    className="input input-bordered input-xs"
                    onChange={e => {
                      // Update the altTexts array with the new alt text
                      const newAltTexts = [...altTexts];
                      newAltTexts[index] = e.target.value;
                      setAltTexts(newAltTexts);
                    }}
                    value={altTexts[index] || ''}
                    disabled={!editMode}
                  />

                  {index === 0 && filesData?.length > 1 && (
                    <div
                      className="cursor-pointer ml-4"
                      onClick={() => {
                        // Apply alt text to all files
                        const newAltTexts = new Array(filesData.length).fill(altTexts[0] || '');
                        setAltTexts(newAltTexts);
                        onAltTextChange(newAltTexts);
                      }}>
                      <p className="text-xs font-semibold w-19 text-primary">Apply to All</p>
                    </div>
                  )}
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
      {/* <pre>{JSON.stringify({ value: formatData() }, null, 2)}</pre> */}
    </>
  );
}
