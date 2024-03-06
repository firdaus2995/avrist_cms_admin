import React, { useState } from 'react';
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

const TextInputDropDown = ({
  id,
  inputStyle,
  disabled,
  themeColor,
  roundStyle = 'xl',
  error,
  helperText,
  onChange,
  items,
}: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = items.filter((option: { label: string }) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleInputChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setSearchTerm(e.target.value);
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (option: string) => {
    setSearchTerm(option);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div

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
          placeholder="Search, select or create an option..."
          value={searchTerm}
          onChange={handleInputChange}
          disabled={disabled}
          onFocus={() => {
            setIsOpen(true);
          }}
          className={`w-full h-full rounded-3xl px-1 outline-0 ${inputStyle} ${
            disabled ? 'text-[#637488]' : ''
          }`}
        />
        <div
          onClick={() => {
            if(!disabled) {
              setIsOpen(!isOpen);
            }
          }}
          className={`
            flex items-center 
            justify-center cursor-pointer 
            w-10 h-10 rounded-lg 
            -mr-3 hover:bg-slate-300
            ${isOpen && 'animate-pulse'}
          `}>
          <img src={isOpen ? ChevronUp : ChevronDown} className="w-6 h-6" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute mt-2 bg-white border rounded-xl w-full max-h-64 shadow-lg overflow-auto">
          {filteredOptions.length > 0 ? (
            <ul>
              {filteredOptions.map((option: any, index: any) => (
                <li
                  key={index}
                  onClick={() => {
                    handleOptionClick(option.label);
                  }}
                  className="px-4 py-2 rounded-xl cursor-pointer hover:bg-light-purple m-1">
                  {option.label}
                </li>
              ))}
            </ul>
          ) : (
            false && <p className="px-4 py-2 text-gray-500">{t('components.molecules.no-matching-option')}</p>
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

export default TextInputDropDown;
