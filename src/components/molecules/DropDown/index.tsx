import React, { useEffect, useRef, useState } from "react";
import CheckMark from "../../../assets/checkmark.png";
import ChevronUp from "../../../assets/chevronup.png"
import ChevronDown from "../../../assets/chevrondown.png";
import { IDropDown, IItems } from "./interfaces";

const DropDown = ({
  items,
  defaultValue,
  onSelect,
}: IDropDown) => {
  const componentRef = useRef<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | number | boolean>(() => {
    const found: string | number | boolean | undefined = items?.find((element: any) => element.value === defaultValue)?.value;
    if (found !== undefined) {
      return found;
    } else {
      return "Select";
    };
  });

  useEffect(() => {
    const handleClickOutside: any = (event: React.SyntheticEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setOpen]);
  
  const handleSelect = (event: React.SyntheticEvent, value: string | number | boolean) => {
    setSelected(value);
    setOpen(false);
    if (onSelect) onSelect(event, value);
  };

  if (!items || items.length < 1) {
    return (
      <h2 className="text-red-700">Component Dropdown Error</h2>
    )
  }

  return (
    <div className="w-full" ref={componentRef}>
      <button onClick={() => {
        setOpen(!open); 
      }} tabIndex={0} className="flex flex-row justify-between items-center p-3 h-[50px] w-full border-[1px] border-neutral-300 rounded-3xl bg-transparent box-border text-left text-sm focus:border-purple-600">
        {selected}
        <img src={open ? ChevronUp : ChevronDown} className="w-6 h-6" />
      </button>
      <ul tabIndex={0} className={`p-2 mt-0.5 shadow bg-base-100 rounded-box w-full border-[1px] border-neutral-300 rounded-3xl ${!open && `invisible`}`}>
        {
          items.map((element: IItems, keyIndex: number) => {
            return (
              selected === element.value ? (
                <li className="flex flex-row justify-between items-center	active:bg-purple-700 hover:bg-purple-100 p-3 rounded-xl text-purple-700 font-bold text-sm active:text-white" key={keyIndex} onClick={(event: React.SyntheticEvent) => {
                  handleSelect(event, element.value)
                }}>
                  <a className="">{element.label}</a>
                  <img src={CheckMark} className="w-6 h-6" />
                </li>
              ) : (
                <li className="flex flex-row justify-between items-center active:bg-purple-700 text-sm hover:bg-purple-100 p-3 rounded-xl active:text-white" key={keyIndex} onClick={(event: React.SyntheticEvent) => {
                  handleSelect(event, element.value)
                }}>
                  <a>{element.label}</a>
                </li>
              )
            )
          })
        }
      </ul>
    </div>
  )
}

export default DropDown;
