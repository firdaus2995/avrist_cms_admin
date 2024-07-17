import React from 'react';

import DeleteComponentIcon from '../../../../assets/efb/preview-delete.svg';

interface IRangeDatePicker {
  name: string;
  placeholder: string;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const RangeDatePicker: React.FC<IRangeDatePicker> = ({
  name,
  placeholder,
  isActive,
  onClick,
  onDelete,
}) => {
  return (
    <div
      className={`flex flex-col py-4 px-4 bg-light-purple-2 rounded-xl gap-2 border-[1px] ${
        isActive ? 'border-lavender' : 'border-light-purple-2'
      }`}
      onClick={onClick}>
      <p className="font-bold text-sm">{name}</p>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2 w-full">
          <span className="flex flex-row gap-2 items-center">
            <p className="text-sm font-bold">From</p>
            <input
              type="date"
              placeholder={placeholder}
              className="h-[40px] w-full text-sm input input-bordered outline-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#D2D4D7]"
            />
          </span>

          <span className="flex flex-row gap-2 items-center">
            <p className="text-sm font-bold">To</p>
            <input
              type="date"
              placeholder={placeholder}
              className="h-[40px] w-full text-sm input input-bordered outline-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#D2D4D7]"
            />
          </span>
        </div>
        <img
          src={DeleteComponentIcon}
          className="cursor-pointer"
          onClick={(event: React.SyntheticEvent) => {
            event.stopPropagation();
            onDelete();
          }}
        />
      </div>
    </div>
  );
};

export default RangeDatePicker;
