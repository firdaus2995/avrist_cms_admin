import React, { 
  useEffect, 
  useRef, 
  useState,
} from "react";

import CheckMark from "../../../assets/checkmark.png";
import ChevronUp from "../../../assets/chevronup.png"
import ChevronDown from "../../../assets/chevrondown.png";
import { 
  IDropDown, 
  IItems,
} from "./interfaces";

const DropDown = ({
  labelTitle,
  labelStyle,
  items,
  defaultValue,
  onSelect,
}: IDropDown) => {
  const componentRef = useRef<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<string | number | boolean>("Select");
  const [selected, setSelected] = useState<string | number | boolean | null>(null);

  useEffect(() => {
    if (defaultValue) {      
      const found: any = items?.find((element: any) => {
        return element.value === defaultValue
      });      
      if (found !== undefined) {
        setSelected(found.value);
        setSelectedLabel(found.label);
      };
    };
  }, [defaultValue])

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
  
  const handleSelect = (event: React.SyntheticEvent, value: string | number | boolean, label: string | number | boolean) => {
    setSelected(value);
    setSelectedLabel(label);
    setOpen(false);
    if (onSelect) onSelect(event, value);
  };

  if (!items || items.length < 1) {
    return (
      <h2 className="text-red-900">Component Dropdown Error</h2>
    )
  }

  return (
    <div className="w-full relative" ref={componentRef}>
      <label className="label">
        <span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}</span>
      </label>
      <button onClick={(event: React.SyntheticEvent) => {
        event.preventDefault();
        setOpen(!open); 
      }} tabIndex={0} className="flex flex-row justify-between items-center p-3 w-full h-[48px] border-[1px] border-neutral-300 rounded-3xl bg-transparent box-border text-left text-sm focus:border-purple-600">
        {selectedLabel}
        <img src={open ? ChevronUp : ChevronDown} className="w-6 h-6" />
      </button>
      <ul tabIndex={0} className={`absolute p-2 mt-0.5 shadow bg-base-100 rounded-box w-full max-h-52 overflow-auto border-[1px] border-neutral-300 rounded-3xl ${!open && `hidden`}`}>
        {
          items.map((element: IItems, keyIndex: number) => {
            return (
              selected === element.value ? (
                <li className="flex flex-row justify-between items-center	active:bg-purple-900 hover:bg-purple-100 p-3 rounded-xl text-purple-900 font-bold text-sm active:text-white" key={keyIndex} onClick={(event: React.SyntheticEvent) => {
                  handleSelect(event, element.value, element.label)
                }}>
                  <a className="">{element.label}</a>
                  <img src={CheckMark} className="w-6 h-6" />
                </li>
              ) : (
                <li className="flex flex-row justify-between items-center active:bg-purple-900 text-sm hover:bg-purple-100 p-3 rounded-xl active:text-white" key={keyIndex} onClick={(event: React.SyntheticEvent) => {
                  handleSelect(event, element.value, element.label)
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
