import React, { useState } from 'react';
import Typography from '@/components/atoms/Typography';
import UploadDocumentIcon from '@/assets/efb/preview-document.svg';

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
}

const FileUploader: React.FC<DragAndDropProps> = ({ multiple, onFilesChange, fieldType, name }) => {
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

  return (
    <div>
      <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
        {name}
      </Typography>
      <div className="flex flex-row">
        <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
          {fieldType}
        </Typography>
        <div
          className="w-[500px] h-[200px] bg-form-disabled-bg flex flex-col justify-center items-center border-dashed border-[1px] border-lavender rounded-lg gap-2 p-2"
          onDrop={handleDrop}
          onDragOver={e => {
            e.preventDefault();
          }}>
          <div>
            <img src={UploadDocumentIcon} />
            <span className="text-xs text-center">
              Drag and Drop Files or click to <p className="text-primary inline">Browse</p>
            </span>
          </div>
          <input type="file" onChange={handleChange} multiple={multiple} />

          {fileData.map(file => (
            <div key={file.name} className="flex flex-row w-full h-20 bg-red-100">
              {/* <p>Filename: {file.name}</p>
              <p>Type: {file.type}</p>
              <p>Size: {file.size} bytes</p> */}
              {file.type.startsWith('image/') ? (
                <img
                  className="object-cover h-20 w-20"
                  src={`data:${file.type};base64,${file.base64}`}
                  alt={file.name}
                />
              ) : (
                <div className="h-20 w-20"></div>
              )}
              {/* <p>Base64: {file.base64}</p> */}
              <button
                className="btn"
                onClick={() => {
                  handleDelete(file);
                }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
