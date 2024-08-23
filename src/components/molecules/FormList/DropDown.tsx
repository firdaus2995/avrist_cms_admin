import { useEffect, useState } from 'react';
import ChevronUp from '@/assets/chevronup.png';
import ChevronDown from '@/assets/chevrondown.png';
import ErrorSmallIcon from '@/assets/error-small.svg';
import { t } from 'i18next';

// const items = [
//   { value: 'apple', label: 'Apple' },
//   { value: 'banana', label: 'Banana' },
//   { value: 'cherry', label: 'Cherry' },
//   { value: 'date', label: 'Date' },
//   { value: 'fig', label: 'Fig' },
//   { value: 'grape', label: 'Grape' },
//   { value: 'kiwi', label: 'Kiwi' },
//   { value: 'lemon', label: 'Lemon' },
//   { value: 'mango', label: 'Mango' },
// ];

const DropDown = ({
  id,
  inputStyle,
  disabled,
  themeColor,
  inputWidth,
  inputHeight = 36,
  roundStyle = 'xl',
  error,
  helperText,
  onChange,
  items,
  resetValue,
  defaultValue,
}: any) => {
  const [searchTerm, setSearchTerm] = useState(defaultValue || '');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = items;

  const handleOptionClick = (option: string) => {
    setSearchTerm(option);
    setIsOpen(false);
  };

  useEffect(() => {
    setSearchTerm(defaultValue || '');
    setIsOpen(false);
  }, [resetValue, defaultValue]);

  return (
    <div className="relative w-full" style={{ flex: '1' }}>
      <div
        style={{ width: inputWidth ?? '100%', height: inputHeight ?? '' }}
        className={`
            flex
            flex-row
            items-center
            input
            input-bordered 
            rounded-${roundStyle} ${themeColor ? `border-${themeColor}` : ''} 
            focus-within:outline 
            focus-within:outline-2 
            focus-within:outline-offset-2 
            focus-within:outline-${themeColor ?? '[#D2D4D7]'} 
            ${disabled ? 'bg-[#E9EEF4] ' : ''} 
            ${error ? 'border-reddist' : ''}
          `}>
        <input
          id={id}
          type="text"
          placeholder="Select an option..."
          value={searchTerm}
          disabled={disabled}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={`text-sm w-full h-full rounded-xl px-1 outline-0 ${inputStyle} ${
            disabled ? 'text-[#637488] bg-[#E9EEF4] ' : ''
          }`}
        />
        <div
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
            }
          }}
          className={`
            flex items-center 
            justify-center cursor-pointer 
            w-[36px] h-[36px] rounded-xl 
            -mr-3 hover:bg-slate-300
            ${isOpen && 'animate-pulse'}
          `}>
          <img src={isOpen ? ChevronUp : ChevronDown} className="w-6 h-6" />
        </div>
      </div>
      {isOpen && (
        <div
          style={{ width: inputWidth ?? '100%' }}
          className="absolute mt-2 bg-white border rounded-xl w-full max-h-64 shadow-lg overflow-auto z-50">
          {filteredOptions.length > 0 ? (
            <ul>
              {filteredOptions.map((option: any, index: any) => (
                <li
                  key={index}
                  onClick={() => {
                    handleOptionClick(option.label);
                    onChange(option);
                  }}
                  className={`text-sm px-4 py-2 rounded-xl cursor-pointer hover:bg-light-purple m-1 ${
                    option.label === searchTerm &&
                    'text-primary font-bold flex flex-row justify-between'
                  }`}>
                  {option.label}
                  {option.label === searchTerm && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 font-bold">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-2 text-gray-500">
              {t('components.molecules.no-matching-option')}
            </p>
          )}
        </div>
      )}
      {error && (
        <div className="flex flex-row px-1 py-2">
          <img src={ErrorSmallIcon} className="mr-3" />
          <p className="text-reddist text-sm">{helperText}</p>
        </div>
      )}
    </div>
  );
};

export default DropDown;
