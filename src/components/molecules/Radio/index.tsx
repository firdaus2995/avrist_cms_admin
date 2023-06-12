import React, { useEffect, useState } from "react";
import { 
  IItems,
  IRadio,
} from "./interfaces";

const Radio = ({
  labelTitle,
  labelStyle,
  labelRequired,
  items,
  defaultSelected,
  onSelect,
}: IRadio) => {
  const [checked, setChecked] = useState<any>(null);

  useEffect(() => {
    if (defaultSelected) setChecked(defaultSelected);
  }, [defaultSelected])
  
  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>, value: string | number | boolean) => {
    setChecked(value);
    if (onSelect) onSelect(event, value);
  };

  if (!items || items.length < 1) {
    return (
      <h2 className="text-red-900">Component Radio Error</h2>
    )
  }

  return (
    <div className="w-full flex flex-col">
      <label className="label">
        <span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}<span className={'text-required-text'}>{labelRequired ? '*' : ''}</span></span>
      </label>
      <div className="flex flex-row gap-2 h-[48px] items-center">
        {
          items.map((element: IItems, keyIndex: number) => {
            return (
              <div className="form-control" key={keyIndex} >
                <label className="label cursor-pointer flex flex-row gap-2">
                  <input type="radio" name="radio-10" className="radio checked:bg-purple" value={element.value} checked={checked === element.value} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleSelect(event, element.value)
                  }} />
                  <span className="label-text">{element.label}</span> 
                </label>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Radio;
