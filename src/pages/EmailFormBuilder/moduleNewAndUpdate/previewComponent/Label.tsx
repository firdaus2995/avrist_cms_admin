import React from "react";

import DeleteComponentIcon from "../../../../assets/efb/preview-delete.svg"

interface ILabel {
  name: string;
  isActive: boolean;
  alignment: string;
  onClick: () => void;
  onDelete: () => void;
}

const TextField: React.FC<ILabel> = ({
  name,
  isActive,
  alignment,
  onClick,
  onDelete,
}) => {
  return (
    <div 
      className={`flex flex-row justify-between items-center py-4 px-4 bg-light-purple-2 rounded-xl gap-2 border-[1px] ${isActive ? 'border-lavender' : 'border-light-purple-2'}`}
      onClick={onClick}
    >
      <span className={`flex flex-1 ${alignment === "LEFT" ? "justify-start" : alignment === "MIDDLE" ? "justify-center" : "justify-end"} font-bold text-lg`}>{name}</span>
      <img 
        src={DeleteComponentIcon}
        className="cursor-pointer"
        onClick={(event: React.SyntheticEvent) => {
          event.stopPropagation()
          onDelete();
        }}
      />
    </div>
  )
};

export default TextField;
