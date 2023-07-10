import React from "react";

import DeleteComponentIcon from "../../../assets/efb/preview-delete.svg"

interface ILabel {
  name: string;
  onDelete: () => void;
}

const TextField: React.FC<ILabel> = ({
  name,
  onDelete,
}) => {
  return (
    <div className="flex flex-row justify-between items-center py-4 px-4 bg-light-purple-2 rounded-xl gap-2">
      <span className="font-bold text-lg">{name}</span>
      <img 
        src={DeleteComponentIcon}
        className="cursor-pointer"
        onClick={() => {
          onDelete();
        }}
      />
    </div>
  )
};

export default TextField;
