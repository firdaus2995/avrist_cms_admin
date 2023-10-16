import React, { useState, useRef, useEffect } from 'react';
import UploadDocumentIcon from '@/assets/upload-file-2.svg';
import Document from '@/assets/modal/document-orange.svg';
import Close from '@/assets/close.png';
import { getCredential } from '@/utils/Credential';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import { formatFilename } from '@/utils/logicHelper';
import { LoadingCircle } from '../../atoms/Loading/loadingCircle';
import { t } from 'i18next';
// import AdobePdfIcon from '@/assets/adobe-pdf.svg';
// import { getImage } from '../../../utils/imageUtils';

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
  onCombineDataChange,
  value,
  showMaxSize,
  // editMode= false,
}: any) {
  const dispatch = useAppDispatch();
  const [filesData, setFilesData] = useState<any>([]);
  const [isUploadLoading, setIsUploadLoading] = useState<any>(false);
  const [altTexts, setAltTexts] = useState<string[]>([]);
  const inputRef = useRef<any>(null);
  // const [imageUrls, setImageUrls] = useState<any>([]);

  const formatData = () => {
    const formattedData = filesData.map((data: any, index: any) => {
      return {
        imageUrl: data.response,
        altText: altTexts[index] || '',
      };
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

  // function safeParseJSON(jsonString: any) {
  //   try {
  //     return JSON.parse(jsonString);
  //   } catch (e) {
  //     console.error('Error parsing JSON:', e);
  //     return [];
  //   }
  // }

  // useEffect(() => {
  //   const parsedValue = safeParseJSON(value);
  //   if (parsedValue) {
  //     const loadImages = async () => {
  //       const urls = await Promise.all(
  //         parsedValue.map(async (element: any) => await getImage(element.imageUrl)),
  //       );
  //       if (urls) {
  //         setImageUrls(urls);
  //       }
  //     };

  //     void loadImages();
  //   }
  // }, [value]);

  // const FileItemPreview = (props: any) => {
  //   const { image, isDocument } = props;
  //   return (
  //     <>
  //       <div className="flex flex-row items-center h-16 p-2 mt-3 rounded-xl bg-light-purple-2">
  //         {isDocument ? (
  //           <img className="object-cover h-12 w-12 rounded-lg mr-3 border" src={AdobePdfIcon} />
  //         ) : (
  //           <div
  //             className="h-12 w-12 rounded-lg bg-[#5E217C] bg-cover"
  //             style={{ backgroundImage: `url(${image?.objectUrl})` }}></div>
  //         )}
  //         <div className="flex flex-1 h-14 justify-center flex-col ml-3">
  //           <p className="truncate w-52">{image?.imageName ?? ''}</p>
  //           <p className="text-body-text-3 text-xs">
  //             {image?.fileSize ? bytesToSize(image?.fileSize) : ''}
  //           </p>
  //         </div>
  //         <div className="h-11">
  //           <div
  //             data-tip={'Delete'}
  //             className="tooltip cursor-pointer w-6 h-6 rounded-full hover-bg-light-grey justify-center items-center flex"
  //             // onClick={onDeletePress}
  //             onClick={()=> { console.log(value); }}
  //             >
  //             <img src={Close} className="w-5 h-5" />
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // };

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
          <div className="w-full flex flex-row justify-between">
            <p className="text-body-text-3 text-xs mt-2">{`Only Support format ${
              isDocument ? '.pdf' : '.jpg, .jpeg, .png'
            }`}</p>
            {showMaxSize ? (
              <p className="text-body-text-3 text-xs mt-2">{`Max. ${maxSize
                .toString()
                .slice(0, 1)} MB`}</p>
            ) : null}
          </div>
        </>
      )}
      <div>
        {/* PREVIEW */}
        {/* {!filesData.length && safeParseJSON(value).map((data: any, i: any) => {
          return (
            <FileItemPreview
              key={i}
              image={imageUrls[i]} // Pass the appropriate imageUrls object
              altText={data.altText} // You can also pass other information as needed
              index={i}
              isDocument={isDocument}
            />
          );
        })} */}

        {filesData.map((data: any, index: any) => {
          return (
            <div key={index}>
              <FileItem
                {...data}
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
              {!isDocument && (
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

                      // Call the onAltTextChange function with the updated altTexts array
                      onAltTextChange(newAltTexts);
                    }}
                    value={altTexts[index] || ''}
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
