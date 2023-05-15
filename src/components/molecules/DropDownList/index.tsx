import React, { useEffect, useRef, useState } from "react";
import ChevronUp from "../../../assets/chevronup.png";
import Close from "../../../assets/close.png";
import CloseWhite from "../../../assets/closewhite.png";
import ChevronDown from "../../../assets/chevrondown.png";
import { IDropDownList } from "./interfaces";
import { IItems } from "../DropDown/interfaces";

const DropDownList = ({
  items,
  defaultValue,
  onSelect,
}: IDropDownList) => {
  const componentRef = useRef<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Array<string | number | boolean>>(() => {
    if (defaultValue && defaultValue?.length > 0 ) {
      return defaultValue;
    } else {
      return [];
    }
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
    const currentSelected: Array<string | number | boolean> = JSON.parse(JSON.stringify(selected));
    const index: number = currentSelected.indexOf(value);
    if (index !== -1) {
      currentSelected.splice(index, 1);
    } else {
      currentSelected.push(value);
    };
    setSelected(currentSelected);
    setOpen(false);
    if (onSelect) onSelect(event, currentSelected);
  };

  const handleRemove = (event: React.SyntheticEvent, value: string | number | boolean) => {
    event.stopPropagation();
    const currentSelected: Array<string | number | boolean> = JSON.parse(JSON.stringify(selected));
    currentSelected.splice(currentSelected.indexOf(value), 1);
    setSelected(currentSelected);
    if (onSelect) onSelect(event, currentSelected);
  };

  if (!items || items.length < 1) {
    return (
      <h2 className="text-red-700">Component Dropdown List Error</h2>
    )
  }
  
  return (
    <div className="w-full" ref={componentRef}>
      <button onClick={() => {
        setOpen(!open); 
      }} tabIndex={0} className="flex flex-row justify-between p-3 w-full border-[1px] border-neutral-300 rounded-3xl bg-transparent box-border text-left text-sm focus:border-purple-600">
        <div className="flex flex-wrap gap-x-2 gap-y-2 w-9/12">
          {
            selected.map((element: string | number | boolean, keyIndex: number) => {
              return (
                <button key={keyIndex} className="px-2 py-2.5 bg-purple-900 flex justify-between rounded-xl items-center text-white gap-2 items-center">
                  {element}
                  <img src={CloseWhite} className="w-6 h-6" onClick={(event: React.SyntheticEvent) => {
                    handleRemove(event, element);
                  }}/>
                </button>
              )
            })
          }
        </div>
        <div className={`flex w-3/12 ${selected.length > 0 ? 'justify-between' : 'justify-end'}`}>
          <img src={Close} className={`w-6 h-6 ${selected.length > 0 ? 'visible' : 'hidden'}`} onClick={(event: React.SyntheticEvent) => {
            event.stopPropagation();
            setSelected([]);
            if (onSelect) onSelect(event, []);
          }}/>
          <img src={open ? ChevronUp : ChevronDown} className="w-6 h-6" />
        </div>
      </button>
      <ul tabIndex={0} className={`p-2 mt-0.5 shadow bg-base-100 rounded-box w-full max-h-52 overflow-auto border-[1px] border-neutral-300 rounded-3xl ${!open && `hidden`}`}>
        {
          items.map((element: IItems, keyIndex: number) => {
            return (
              selected.includes(element.value) ? (
                <li className="flex flex-row justify-between items-center	active:bg-purple-900 hover:bg-purple-100 p-3 rounded-xl text-purple-900 font-bold text-sm active:text-white" key={keyIndex} onClick={(event: React.SyntheticEvent) => {
                  handleSelect(event, element.value)
                }}>
                  <a>{element.label}</a>
                </li>
              ) : (
                <li className="flex flex-row justify-between items-center active:bg-purple-900 text-sm hover:bg-purple-100 p-3 rounded-xl active:text-white" key={keyIndex} onClick={(event: React.SyntheticEvent) => {
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

export default DropDownList;
