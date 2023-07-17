import React, { useState } from "react";
import PlusIcon from "../../../assets/plus-dark.svg";
import CloseSolid from "../../../assets/close-solid.svg";
import ErrorSmall from "../../../assets/error-small.svg";

interface IMultipleInput {
  labelTitle: string;
  labelWidth?: number;
  labelStyle?: string;
  inputWidth?: number;
  inputStyle?: string;
  placeholder?: string;
  items: string[];
  logicValidation?: any;
  errorAddValueMessage?: string;
  onAdd: (value: string) => void;
  onDelete: (index: number) => void;
}

export const MultipleInput: React.FC<IMultipleInput> = ({
  labelTitle,
  labelWidth = 225,
  labelStyle,
  inputWidth,
  inputStyle,
  placeholder,
  items,
  logicValidation,
  errorAddValueMessage,
  onAdd,
  onDelete,
}) => {
  const [addValue, setAddValue] = useState("");
  const [errorAddValue, setErrorAddValue] = useState(false);

  return (
    <div className={`flex flex-row`}>
      <label style={{
        width: labelWidth,
      }} className={`label ${labelStyle}`}>
        <span className={`label-text text-base-content`}>{labelTitle}</span>
      </label>
      <div className="flex flex-col gap-3" style={{
        width: inputWidth ?? '100%'
      }}>
        {/* THE ADD INPUT */}
        <div className="flex flex-col gap-2">
          <div className={`flex flex-row items-center input input-bordered focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#D2D4D7] ${errorAddValue ? 'border-reddist' : ''} ${inputStyle}`}>
            <input
              type="text"
              className="w-full h-full outline-0"
              value={addValue}
              placeholder={placeholder ?? ""}
              onChange={(e: any) => {
                setAddValue(e.target.value)
              }}
            />
            <img src={PlusIcon} className='w-[24px] h-[24px] cursor-pointer' onClick={() => {
              if (logicValidation) {
                if (logicValidation(addValue)) {
                  onAdd(addValue);
                  setAddValue("");
                  setErrorAddValue(false);
                } else {
                  setErrorAddValue(true);
                };
              } else {
                onAdd(addValue);
                setAddValue("");
              }
            }}/>
          </div>
          {
            errorAddValue && (
              <div className="flex flex-row gap-2">
                <img src={ErrorSmall} />
                <p className="text-xs text-reddist">{errorAddValueMessage}</p>
              </div>
            )
          }
        </div>
        {/* THE ITEMS */}
        {
          items.map((item: any, index: number) => {
            return (
              <div key={index} className="relative flex items-center w-[400px] h-[46px] px-[16px] py-[10px] bg-light-purple-2 rounded-xl">
                {item}
                <img className="absolute top-[-5px] right-[-5px] cursor-pointer" src={CloseSolid} onClick={() => {
                  onDelete(index);
                }}/>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};
