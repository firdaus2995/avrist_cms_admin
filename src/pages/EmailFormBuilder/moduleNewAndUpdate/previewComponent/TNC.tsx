import React, { useState } from "react";

import DeleteComponentIcon from "../../../../assets/efb/preview-delete.svg"
import { CheckBox } from "@/components/atoms/Input/CheckBox";

interface ITNC {
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const Image: React.FC<ITNC> = ({
  isActive,
  onClick,
  onDelete,
}) => {
  const [value, setValue] = useState<boolean>(true);

  return (
    <div 
      className={`flex flex-col py-4 px-4 bg-light-purple-2 rounded-xl gap-2 border-[1px] ${isActive ? 'border-lavender' : 'border-light-purple-2'}`}
      onClick={onClick}
    >
      <div className="flex flex-row justify-between gap-2">
        <CheckBox
          defaultValue={value}
          containerStyle="w-full flex flex-row flex-start"
          labelTitle={(
            <>Ya. Saya telah membaca dan menyetujui <span className="text-[#2C89F5] font-bold">Syarat dan Ketentuan</span></>
          )}
          labelStyle="max-w-[220px] font-normal"
          inputStyle="w-[20px] h-[20px]"
          updateFormValue={(event: any) => {
            setValue(event.value);
          }}
        />
        <img 
          src={DeleteComponentIcon}
          className="cursor-pointer self-center"
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
