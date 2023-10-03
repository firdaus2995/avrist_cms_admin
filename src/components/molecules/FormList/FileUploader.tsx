import React, { useState, useRef } from 'react';
import Typography from '@/components/atoms/Typography';
import UploadDocumentIcon from '@/assets/upload-file.svg';
import Document from '@/assets/modal/document-orange.svg';
import Close from '@/assets/close.png';
import { t } from 'i18next';

interface FileData {
  name: string;
  type: string;
  size: number;
  base64: string;
}

interface DragAndDropProps {
  multiple: boolean;
  onFilesChange: (files: FileData[]) => void;
  fieldType: string;
  name: string;
  key: number;
}

const FileUploader: React.FC<DragAndDropProps> = ({
  key,
  multiple,
  onFilesChange,
  fieldType,
  name,
}) => {
  const [fileData, setFileData] = useState<FileData[]>([]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    void handleFiles([...e.dataTransfer.files]);
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    void handleFiles([...e.target.files]);
  };

  const handleFiles = async (files: File[]) => {
    const fileDataArray = await Promise.all(
      files.map(async file => {
        const base64 = await getBase64(file);
        return { name: file.name, type: file.type, size: file.size, base64 };
      }),
    );
    setFileData(prevFileData => [...prevFileData, ...fileDataArray]);
    if (onFilesChange) {
      onFilesChange([...fileData, ...fileDataArray]);
    }
  };

  const getBase64 = async (file: File): Promise<any> => {
    return await new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result?.toString().split(',')[1]);
      };
    });
  };

  const handleDelete = (fileToDelete: FileData) => {
    const updatedFileData = fileData.filter(file => file !== fileToDelete);
    setFileData(updatedFileData);
    if (onFilesChange) {
      onFilesChange(updatedFileData);
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  function bytesToSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2).toString() + ' ' + sizes[i];
  }

  return (
    <div key={key}>
      <Typography type="body" size="m" weight="bold" className="w-56 mt-5 ml-1">
        {name}
      </Typography>
      <div className="flex flex-row">
        <Typography type="body" size="m" weight="bold" className="w-40 mt-5 ml-1 mr-9">
          {fieldType}
        </Typography>
        <div>
          <div
            className="w-[500px] min-h-[200px] bg-light-purple-2 flex flex-col justify-center items-center border-dashed border-[1px] border-lavender rounded-xl gap-2 p-2"
            onDrop={handleDrop}
            onDragOver={e => {
              e.preventDefault();
            }}>
            <input
              id="icon-button-file"
              className="hidden"
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              multiple={multiple}
            />
            <div
              onClick={handleCardClick}
              className="flex flex-col items-center justify-center h-[100px] cursor-pointer">
              <img src={UploadDocumentIcon} />
              <span className="text-xs text-center mt-5">{t('components.molecules.file.drag')}</span>
            </div>

            {fileData.map(file => (
              <div key={file.name} className="flex flex-row w-full h-20">
                {/* <p>Filename: {file.name}</p>
              <p>Type: {file.type}</p>
              <p>Size: {file.size} bytes</p> */}
                {/* <p>Base64: {file.base64}</p> */}
                <div className="flex justify-between w-full">
                  <div className="flex flex-row">
                    {file.type.startsWith('image/') ? (
                      <img
                        className="object-cover h-16 w-16 rounded-lg mr-3"
                        src={`data:${file.type};base64,${file.base64}`}
                        alt={file.name}
                      />
                    ) : (
                      <div className="h-16 w-16 flex justify-center items-center bg-light-purple rounded-lg mr-3">
                        <img className="h-12 w-12" src={Document} alt="document" />
                      </div>
                    )}
                    <div className="h-16 justify-center flex flex-col">
                      <p className="truncate w-52">{file.name}</p>
                      <p className="text-body-text-3 text-sm mt-1">{bytesToSize(file.size)}</p>
                    </div>
                  </div>
                  <div
                    data-tip={'Delete'}
                    className="tooltip cursor-pointer w-8 h-8 rounded-full hover:bg-light-grey justify-center items-center flex"
                    onClick={() => {
                      handleDelete(file);
                    }}>
                    <img src={Close} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-body-text-3 text-xs mt-2">{t('components.molecules.file.support')}</p>
        </div>
      </div>
      <div className="border my-10" />
    </div>
  );
};

export default FileUploader;
