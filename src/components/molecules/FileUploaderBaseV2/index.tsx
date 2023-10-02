import { useState, useRef, useEffect } from 'react';

import UploadDocumentIcon from '@/assets/upload-file-2.svg';
import AdobePdfIcon from '@/assets/adobe-pdf.svg';
import Close from '@/assets/close.png';
import { getCredential } from '@/utils/Credential';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import { copyArray, formatFilename } from '@/utils/logicHelper';
import { LoadingCircle } from '../../atoms/Loading/loadingCircle';
import { getImageAxios } from '../../../services/Images/imageUtils';

const baseUrl = import.meta.env.VITE_API_URL;
const maxDocSize = import.meta.env.VITE_MAX_FILE_DOC_SIZE;
const maxImgSize = import.meta.env.VITE_MAX_FILE_IMG_SIZE;

function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2).toString() + ' ' + sizes[i];
};

const PreviewFileItem = ({
  isDocument,
  item, 
  imageUrls, 
  onDeletePress, 
  index,
}: any) => {
  const [imageInfo, setImageInfo] = useState<any>({});

  useEffect(() => {
    if (imageUrls) {
      setImageInfo(imageUrls[index]);
    };
  }, [imageUrls]);

  return (
    <div className="flex flex-row items-center h-16 p-2 mt-3 rounded-xl bg-light-purple-2">
      <img
        className="object-cover h-12 w-12 rounded-lg mr-3 border"
        src={isDocument ? AdobePdfIcon : imageInfo?.url ?? ''}
        alt={item}
      />
      <div className="flex flex-1 h-14 justify-center flex-col">
        <p className="truncate w-52">{imageInfo?.imageName ?? ''}</p>
        <p className="text-body-text-3 text-xs">{imageInfo?.fileSize ? bytesToSize(imageInfo?.fileSize) : ''}</p>
      </div>
      <div className="h-11">
        <div
          data-tip={'Delete'}
          className="tooltip cursor-pointer w-6 h-6 rounded-full hover:bg-light-grey justify-center items-center flex"
          onClick={onDeletePress}
        >
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
  parentData,
}: any) {
  const dispatch = useAppDispatch();
  const inputRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (parentData?.items) {
      const loadImages = async () => {
        const urls = await Promise.all(
          parentData.items.map(async (element: any) => {
            console.log(element);
            
            return await getImageAxios(element);
          }),
        );
        setImageUrls(urls);
      };

      void loadImages();
    }
  }, [parentData?.items]);

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

    if (parentData?.items?.some((item: any) => item.name === fileName)) {
      dispatch(
        openToast({
          type: 'error',
          title: 'Duplicate File',
          message: 'File already uploaded',
        }),
      );
      return;
    };

    body.append('file', files[0]);
    body.append('fileType', isDocument ? 'DOCUMENT' : 'IMAGE');
    body.append('fileName', fileName);

    try {
      setIsLoading(true);
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
          const newData: any = copyArray(parentData?.items);
          newData.push(newFile.response);
          onFilesChange(newData);
        } else {
          const newData: any = [newFile.response];
          onFilesChange(newData);
        };
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
    setIsLoading(false);
  };

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={e => {
          e.preventDefault();
        }}
        className={`min-w-[150px] bg-white border-dashed border-[2px] border-lavender rounded-xl`}>
        {(!parentData?.items?.length || multiple) && (
          <label
            htmlFor={id}
            className={`flex flex-col justify-center items-center cursor-pointer ${
              isLoading && 'cursor-wait'
            } ${disabled && 'cursor-no-drop'}`}>
            <input
              ref={inputRef}
              id={id}
              type="file"
              className="hidden"
              accept={isDocument ? 'application/pdf' : 'image/png, image/jpeg, image/jpg'}
              onChange={handleChange}
              disabled={disabled || isLoading}
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
        {parentData?.items?.map((item: any, index: any) => {
          return <PreviewFileItem isDocument={isDocument} key={index} item={item} imageUrls={imageUrls} index={index} onDeletePress={() => {
            const newData: any = copyArray(parentData?.items);
            newData.splice(index, 1);
            onFilesChange(newData);
          }} />;
        })}
      </div>
      <div>
        {isLoading && (
          <div className="flex flex-row items-center justify-center h-16 p-2 mt-3 rounded-xl bg-light-purple-2">
            <LoadingCircle />
          </div>
        )}
      </div>
    </>
  );
}
