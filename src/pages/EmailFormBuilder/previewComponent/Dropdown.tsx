import React, { useEffect, useRef, useState } from "react";

import DeleteComponentIcon from "../../../assets/efb/preview-delete.svg"
import ChevronUp from "../../../assets/chevronup.png"
import ChevronDown from "../../../assets/chevrondown.png";
import CheckMark from "../../../assets/checkmark.png";

interface IDropdown {
  name: string;
  items: string[];
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const Dropdown: React.FC<IDropdown> = ({
  name,
  items,
  isActive,
  onClick,
  onDelete,
}) => {
  const componentRef = useRef<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>((items && items[0]) ? items[0] : "Empty");
  
  useEffect(() => {
    if (items.length > 0) {
      setSelected(items[0]);
    } else {
      setSelected("Empty");
    };
  }, [items]);

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

  return (
    <div 
      className={`flex flex-col py-4 px-4 bg-light-purple-2 rounded-xl gap-2 border-[1px] ${isActive ? 'border-lavender' : 'border-light-purple-2'}`}
      onClick={onClick}
    >
      <p className="font-bold text-sm">{name}</p>
      <div className="flex flex-row gap-2">
        <div className="relative w-full" ref={componentRef}>
          <button 
            className="flex flex-row justify-between items-center bg-white p-3 w-full h-[40px] border-[1px] border-neutral-300 rounded-lg bg-transparent box-border text-left text-sm focus:border-bright-purple"
            onClick={(event: React.SyntheticEvent) => {
              event.preventDefault();
              setOpen(!open); 
            }} 
          >
            {selected}
            <img 
              src={open ? ChevronUp : ChevronDown}
              className="w-6 h-6"
            />
          </button>
          <ul className={`mt-2 absolute p-2 shadow bg-white rounded-box w-full max-h-52 overflow-auto border-[1px] border-neutral-300 rounded-lg ${!open && `hidden`}`}>
            {
              items.map((element: any, keyIndex: number) => {
                return (
                  selected === element ? (
                    <li 
                      key={keyIndex}
                      className="flex flex-row justify-between items-center active:bg-purple text-sm hover:bg-light-purple p-3 rounded-lg active:text-white cursor-pointer text-purple font-bold"
                      onClick={(event: React.SyntheticEvent) => {
                        event.preventDefault();
                        setOpen(false);
                        setSelected(element);
                      }}
                    >
                      <span>{element}</span>
                      <img src={CheckMark} className="w-6 h-6" />
                    </li>
                  ) : (
                    <li 
                      key={keyIndex}
                      className="flex flex-row justify-between items-center active:bg-purple text-sm hover:bg-light-purple p-3 rounded-lg active:text-white cursor-pointer"
                      onClick={(event: React.SyntheticEvent) => {
                        event.preventDefault();
                        setOpen(false);
                        setSelected(element);
                      }}
                    >
                      <span>{element}</span>
                    </li>
                  )
                )
              })
            }
          </ul>
        </div>
        <img 
          src={DeleteComponentIcon}
          className="cursor-pointer"
          onClick={(event: React.SyntheticEvent) => {
            event.stopPropagation()
            onDelete();
          }}
        />
      </div>
    </div>
  )
};

export default Dropdown;
