import React, { useEffect, useState, useRef } from 'react';
import ChevronUp from '@/assets/chevronup.png';
import ChevronDown from '@/assets/chevrondown.png';
import Plus from '@/assets/plus-dark.svg';
import ErrorSmallIcon from '@/assets/error-small.svg';
import { t } from 'i18next';

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
  value,
  onItemClick,
  onCreate,
}: any) => {
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering
  const [selectedValue, setSelectedValue] = useState(value || ''); // Store the selected option
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null); // Create a ref for the dropdown

  const filteredOptions = items.filter((option: any) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleInputChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setSearchTerm(e.target.value); // Update search term on typing
    onChange(e.target.value);
    setSelectedValue('');
    setIsOpen(true); // Open dropdown on typing
  };

  const handleOptionClick = (option: string) => {
    setSelectedValue(option); // Set the selected option
    setSearchTerm(''); // Clear search term after selection
    setIsOpen(false); // Close dropdown
    onChange(option); // Pass selected option to parent
  };

  useEffect(() => {
    setSelectedValue(value || ''); // Update selected value when `value` prop changes
  }, [value]);

  const handleCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onCreate(e); // Trigger onCreate event
    setSearchTerm(''); // Clear search term after creation
    setIsOpen(false); // Close dropdown
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
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
            ${error ? 'border-reddist' : ''}`}>
        <input
          id={id}
          type="text"
          placeholder="Search and select an option..."
          value={isOpen ? (searchTerm !== '' ? searchTerm : selectedValue) : selectedValue} // Show search term when open, else selected value
          onChange={handleInputChange}
          disabled={disabled}
          onFocus={() => {
            setIsOpen(true);
          }} // Open dropdown on focus
          className={`text-sm w-full h-full rounded-3xl px-1 outline-0 ${inputStyle} ${
            disabled ? 'text-[#637488]' : ''
          }`}
        />
        {onCreate && searchTerm.length > 0 && (
          <div
            onClick={handleCreate}
            className={`flex items-center justify-center cursor-pointer w-10 h-10 rounded-lg mr-2 hover:bg-slate-300`}>
            <img src={Plus} className="w-6 h-6" />
          </div>
        )}
        <div
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen); // Toggle dropdown on click
            }
          }}
          className={`flex items-center justify-center cursor-pointer w-10 h-10 rounded-lg -mr-3 hover:bg-slate-300 ${
            isOpen && 'animate-pulse'
          }`}>
          <img src={isOpen ? ChevronUp : ChevronDown} className="w-6 h-6" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute mt-2 bg-white border rounded-xl w-full max-h-64 shadow-lg overflow-auto z-10">
          {filteredOptions.length > 0 ? (
            <ul>
              {filteredOptions.map((option: any, index: any) => (
                <li
                  key={index}
                  onClick={() => {
                    handleOptionClick(option.label); // Set the selected option
                    onItemClick(option.label); // Trigger onItemClick event
                  }}
                  className="px-4 py-2 rounded-xl cursor-pointer hover:bg-light-purple m-1">
                  {option.label}
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

export default TextInputDropDown;
