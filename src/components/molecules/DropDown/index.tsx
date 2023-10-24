import React, { 
  useEffect, 
  useRef, 
  useState,
} from "react";

import ErrorSmallIcon from "../../../assets/error-small.svg";
import CheckMark from "../../../assets/checkmark.png";
import ChevronUp from "../../../assets/chevronup.png"
import ChevronDown from "../../../assets/chevrondown.png";
import { 
  IDropDown, 
  IItems,
} from "./interfaces";
import { t } from "i18next";

const DropDown = ({
  labelTitle,
  labelStyle,
  labelEmpty,
  labelRequired,
  labelWidth = 225,
  inputWidth,
  direction,
  items,
  defaultValue,
  error,
  helperText,
  onSelect,
}: IDropDown) => {
  const componentRef = useRef<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<string | number | boolean>(labelEmpty ?? "Select");
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
  }, [defaultValue, items])

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

  if (!items) {
    return (
      <h2 className="text-red-900">{t('components.molecules.component-dropdown-error')}</h2>
    )
  }

  return (
    <div className='w-full'>
      <div className={`max-w-full flex ${direction === "row" ? "flex-row" : "flex-col w-full"}`}>
        <label 
          style={{
            width: direction === 'row' ? labelWidth : '',
            minWidth: direction === 'row' ? labelWidth : '',
          }}
          className="label"
        >
          <span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}<span className={'text-reddist text-base-content ml-1'}>{labelRequired ? '*' : ''}</span></span>
        </label>
        <div
          style={{
            width: inputWidth ?? '100%',
          }}
          className="relative" 
          ref={componentRef}
        >
          <button 
            onClick={(event: React.SyntheticEvent) => {
              event.preventDefault();
              setOpen(!open); 
            }} 
            tabIndex={0} 
            className={`w-full flex flex-row justify-between items-center p-3 h-[48px] border-[1px] border-neutral-300 rounded-xl bg-transparent box-border text-left text-sm focus:border-bright-purple ${!selected ? "text-body-text-1" : ""} ${error && 'border-reddist'}`}
          >
            {selectedLabel}
            <img src={open ? ChevronUp : ChevronDown} className="w-6 h-6" />
          </button>
          <ul
            tabIndex={0} 
            className={`w-full absolute p-2 mt-0.5 shadow bg-base-100 rounded-box max-h-52 overflow-auto border-[1px] border-neutral-300 rounded-xl z-50 ${!open && `hidden`}`}
          >
            {
              items.map((element: IItems, keyIndex: number) => {
                return (
                  selected === element.value ? (
                    <li className="flex flex-row justify-between items-center	cursor-pointer active:bg-purple hover:bg-light-purple p-3 rounded-xl text-purple font-bold text-sm active:text-white" key={keyIndex} onClick={(event: React.SyntheticEvent) => {
                      handleSelect(event, element.value, element.label)
                    }}>
                      {
                        element.labelExtension ? (
                          <>
                            <div className="flex flex-col">
                              <a>{element.label}</a>
                              <a className="text-xs font-normal text-body-text-1">{element.labelExtension}</a>                        
                            </div>
                            <img src={CheckMark} className="w-6 h-6" />    
                          </>
                        ) : (
                          <>
                            <a className="">{element.label}</a>
                            <img src={CheckMark} className="w-6 h-6" />    
                          </>
                        )
                      }
                    </li>
                  ) : (
                    <li className="flex flex-row justify-between items-center cursor-pointer active:bg-purple text-sm hover:bg-light-purple p-3 rounded-xl active:text-white" key={keyIndex} onClick={(event: React.SyntheticEvent) => {
                      handleSelect(event, element.value, element.label)
                    }}>
                      {
                        element.labelExtension ? (
                          <div className="flex flex-col">
                            <a>{element.label}</a>
                            <a className="text-xs font-normal text-body-text-1">{element.labelExtension}</a>                        
                          </div>
                        ) : (
                          <a>{element.label}</a>
                        )
                      }
                    </li>
                  )
                )
              })
            }
          </ul>
        </div>
        {
          error && (direction === 'column' || !direction) && (
            <div className='flex flex-row px-1 py-2'>
              <img src={ErrorSmallIcon} className='mr-3' />
              <p className='text-reddist text-sm'>{helperText ?? t('components.atoms.required')}</p>
            </div>
          )
        }
      </div>
      {
        error && direction === 'row' && (
          <div className='flex flex-row px-1 py-2' style={{
            marginLeft: labelWidth
          }}>
            <img src={ErrorSmallIcon} className='mr-3' />
            <p className='text-reddist text-sm'>{helperText ?? t('components.atoms.required')}</p>
          </div>
        )
      }
    </div>
  )
}

export default DropDown;
