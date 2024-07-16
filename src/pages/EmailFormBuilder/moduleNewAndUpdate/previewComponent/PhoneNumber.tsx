import React from 'react';

import DeleteComponentIcon from '../../../../assets/efb/preview-delete.svg';

interface IPhoneNumber {
  name: string;
  placeholder: string;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const PhoneNumber: React.FC<IPhoneNumber> = ({
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
        <input
          type="number"
          placeholder={placeholder}
          className="h-[40px] w-full text-sm input input-bordered outline-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#D2D4D7]"
        />
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

export default PhoneNumber;
