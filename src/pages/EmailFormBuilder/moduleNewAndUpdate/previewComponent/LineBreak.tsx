import React from "react";

import DeleteComponentIcon from "../../../../assets/efb/preview-delete.svg"

interface ITextField {
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const LineBreak: React.FC<ITextField> = ({
  isActive,
  onClick,
  onDelete, 
}) => {
  return (
    <div 
      className={`flex flex-col py-4 px-4 bg-light-purple-2 rounded-xl gap-2 border-[1px] ${isActive ? 'border-lavender' : 'border-light-purple-2'}`}
      onClick={onClick}
    >
      <div className="flex flex-row gap-2">
        <div className="w-full mt-auto mb-auto flex justify-center items-center border-[1px] border-[#D6D6D6]" />
        <img 
          src={DeleteComponentIcon}
          className="cursor-pointer"
          onClick={(event: React.SyntheticEvent) => {
            event.stopPropagation()
            onDelete();
          }}
        />
      </div>
    </div>
  )
};

export default LineBreak;
