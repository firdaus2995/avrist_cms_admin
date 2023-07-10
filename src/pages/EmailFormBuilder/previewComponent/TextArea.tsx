import React from "react";

import DeleteComponentIcon from "../../../assets/efb/preview-delete.svg"

interface ITextArea {
  name: string;
  placeholder: string;
  onDelete: () => void;
}

const TextArea: React.FC<ITextArea> = ({
  name,
  placeholder,
  onDelete,
}) => {
  return (
    <div className="flex flex-col py-4 px-4 bg-light-purple-2 rounded-xl gap-2">
      <p className="font-bold text-sm">{name}</p>
      <div className="flex flex-row gap-2">
        <textarea 
          rows={3}
          placeholder={placeholder}
          className="resize-none w-full text-sm textarea textarea-bordered outline-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#D2D4D7]"
        >
          
        </textarea>
        <img 
          src={DeleteComponentIcon}
          className="cursor-pointer self-start"
          onClick={() => {
            onDelete();
          }}
        />
      </div>
    </div>
  )
};

export default TextArea;
