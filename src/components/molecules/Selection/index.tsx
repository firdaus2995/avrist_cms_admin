import React, { useEffect, useRef, useState } from "react";

interface SelectionI {
  title: string;
  containerStyle?: string;
  titleStyle?: string;
  selectionStyle?: string;
  items: Array<{
    value: string | number | boolean;
    label: string;
    icon?: any;
    hoverIcon?: any;
  }>;
  onClickItem: (item: string) => void;
}

const Selection: React.FC<SelectionI> = ({
  title,
  containerStyle,
  titleStyle,
  selectionStyle,
  items,
  onClickItem,
}) => {
  const componentRef = useRef<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);

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
      ref={componentRef}
      className={`w-full relative ${containerStyle ?? ""}`}
    >
      <button 
        tabIndex={0}
        className={`w-full btn btn-outline btn-primary rounded-lg bg-white ${titleStyle ?? ""}`}
        onClick={(event: React.SyntheticEvent) => {
          event.preventDefault();
          setOpen(!open);
        }}
      >
        {title}
      </button>
      <ul 
        tabIndex={0}
        className={`w-full flex flex-col gap-2 absolute mt-2 p-2 shadow rounded-lg bg-white ${!open && `hidden`} ${selectionStyle ?? ""}`}
      >
        {
          items?.map((element: any, index: number) => (
            <button
              key={index}
              className={`btn btn-outline btn-primary flex flex-row ${element.icon && 'justify-start'} rounded-lg`}
              onMouseEnter={() => {
                setHoverPosition(index);
              }}
              onMouseLeave={() => {
                setHoverPosition(null);
              }}
              onClick={() => {
                onClickItem(element.value);
              }}
            >
              {
                element.icon && (
                  <img 
                    src={hoverPosition === index ? element.hoverIcon : element.icon}
                    className="mr-2"
                  />
                )
              }
              {element.label}
            </button>
          ))
        }
      </ul>
    </div>
  )
};

export default Selection;
