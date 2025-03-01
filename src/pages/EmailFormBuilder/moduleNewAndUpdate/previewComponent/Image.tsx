import React from "react";

import DeleteComponentIcon from "../../../../assets/efb/preview-delete.svg"
import UploadDocumentIcon from "../../../../assets/efb/preview-document.svg"

interface IImage {
  name: string;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const Image: React.FC<IImage> = ({
  name,
  isActive,
  onClick,
  onDelete,
}) => {
  return (
    <div 
      className={`flex flex-col py-4 px-4 bg-light-purple-2 rounded-xl gap-2 border-[1px] ${isActive ? 'border-lavender' : 'border-light-purple-2'}`}
      onClick={onClick}
    >
      <p className="font-bold text-sm">{name}</p>
      <div className="flex flex-row gap-2">
        <div className="w-full h-[135px] flex flex-col justify-center items-center border-dashed border-[1px] border-lavender rounded-lg bg-white gap-2 p-2">
          <img src={UploadDocumentIcon} />
          <span className="text-xs text-center">Drag and Drop Files or click to Browse</span>
        </div>
        <img 
          src={DeleteComponentIcon}
          className="cursor-pointer self-start"
          onClick={(event: React.SyntheticEvent) => {
            event.stopPropagation()
            onDelete();
          }}
        />
      </div>
    </div>
  )
};

export default Image;
