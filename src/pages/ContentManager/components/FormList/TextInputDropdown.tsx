import { useState } from 'react';

const TextInputDropdown = () => {
  const [inputText, setInputText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const options = [
    'Option 1',
    'Option 2',
    'Option 3',
    // Add more options here as needed
  ];
  const [selectedOption, setSelectedOption] = useState('');

  const filterOptions = (event: { target: { value: string; }; }) => {
    const searchText = event.target.value.toLowerCase();
    setInputText(searchText);
    setShowDropdown(true);
  };

  const showDropdownMenu = () => {
    setShowDropdown(true);
  };

  const hideDropdownMenu = () => {
    // Add a small delay to hide the dropdown after blur event
    setTimeout(() => {
      setShowDropdown(false);
    }, 100);
  };

  const updateTextInput = (event: { target: { value: any; }; }) => {
    const selectedValue = event.target.value;
    setInputText(selectedValue);
    setSelectedOption(selectedValue);
    setShowDropdown(false);
  };

  const filteredOptions = options.filter(option => option.toLowerCase().includes(inputText));

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        placeholder="Type or select an option"
        value={inputText}
        onChange={filterOptions}
        onFocus={showDropdownMenu}
        onBlur={hideDropdownMenu}
      />
      {showDropdown && (
        <div className="absolute top-10 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <select className="w-full px-4 py-2" value={selectedOption} onChange={updateTextInput}>
            <option value="">Select an option</option>
            {filteredOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default TextInputDropdown;
