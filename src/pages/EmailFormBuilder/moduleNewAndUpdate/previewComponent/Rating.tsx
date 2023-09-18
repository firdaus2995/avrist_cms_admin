import React from "react";

import DeleteComponentIcon from "../../../../assets/efb/preview-delete.svg"

interface IRating {
  id: string;
  name: string;
  items: string[];
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const Rating: React.FC<IRating> = ({
  id,
  name,
  items,
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
        <div className="w-full h-[120px] flex flex-row items-center rounded-lg bg-white p-2 overflow-auto">
          {
            items.map((element: any, keyIndex: number) => {
              return (
                <div key={keyIndex} className={`min-w-[20%] flex flex-col items-center`}>
                  <div className={`w-full flex flex-row items-center`}>
                    {
                      keyIndex === 0 ? (
                        <div className="w-full h-[1px] border-[1px] border-white"/>
                      ) : (
                        <div className="w-full h-[1px] border-[1px] border-form-disabled-bg"/>
                      )
                    }
                    <input type="radio" name={`radio_${id}`} className="radio radio-primary" />
                    {
                      keyIndex === (items.length - 1) ? (
                        <div className="w-full h-[1px] border-[1px] border-white"/>
                      ) : (
                        <div className="w-full h-[1px] border-[1px] border-form-disabled-bg"/>
                      )
                    }
                  </div>
                  <div className="text-center">{element}</div>
                </div>
              )
            })
          }
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

export default Rating;
