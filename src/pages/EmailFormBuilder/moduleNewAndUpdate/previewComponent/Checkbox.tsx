import React from 'react';

import DeleteComponentIcon from '../../../../assets/efb/preview-delete.svg';

interface ICheckbox {
  name: string;
  items: string[];
  other?: boolean;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const Checkbox: React.FC<ICheckbox> = ({ name, items, other, isActive, onClick, onDelete }) => {
  return (
    <div
      className={`flex flex-col py-4 px-4 bg-light-purple-2 rounded-xl gap-2 border-[1px] ${
        isActive ? 'border-lavender' : 'border-light-purple-2'
      }`}
      onClick={onClick}>
      <p className="font-bold text-sm">{name}</p>
      <div className="flex flex-row gap-2">
        <div className="w-full flex flex-col gap-1">
          {items.map((element: any, index: number) => (
            <div key={index} className="form-control">
              <label className="h-[34px] label cursor-pointer p-0 justify-start gap-2">
                <input
                  type="checkbox"
                  className="h-[22px] w-[22px] checkbox checkbox-primary bg-white border-[2px] border-dark-grey"
                />
                <span className="label-text">{element}</span>
              </label>
            </div>
          ))}
          {other && (
            <div className="form-control">
              <label className="h-[34px] label cursor-pointer p-0 justify-start gap-2">
                <input
                  type="checkbox"
                  className="h-[22px] w-[22px] checkbox checkbox-primary bg-white border-[2px] border-other-grey"
                />
                <span className="w-full label-text text-other-grey border-b-[1px] border-other-grey">
                  Other
                </span>
              </label>
            </div>
          )}
        </div>
        <img
          src={DeleteComponentIcon}
          className="cursor-pointer self-start"
          onClick={(event: React.SyntheticEvent) => {
            event.stopPropagation();
            onDelete();
          }}
        />
      </div>
    </div>
  );
};

export default Checkbox;
